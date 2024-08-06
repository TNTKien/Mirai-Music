import {
  Command,
  type CommandContext,
  Declare,
  Embed,
  LocalesT,
  type Message,
  Options,
  type User,
  type WebhookMessage,
  createStringOption,
} from "seyfert";
import { MiraiOptions } from "#mirai/decorators";

import { EmbedColors } from "seyfert/lib/common/index.js";
import { MessageFlags } from "seyfert/lib/types/index.js";

import { parseTime, sliceText } from "#mirai/utils/functions/utils.js";

const options = {
  query: createStringOption({
    description: "Enter the track name or url.",
    required: true,
    locales: {
      name: "locales.play.option.name",
      description: "locales.play.option.description",
    },
    autocomplete: async (interaction) => {
      const { client, member, guildId } = interaction;

      if (!guildId) return;
      const { searchEngine } = await client.database.getPlayer(guildId);

      const { messages } = client
        .t(await client.database.getLocale(guildId))
        .get();

      if (!client.manager.useable)
        return interaction.respond([
          {
            name: messages.commands.play.autocomplete.noNodes,
            value: "noNodes",
          },
        ]);

      const voice = member?.voice();
      if (!voice)
        return interaction.respond([
          {
            name: messages.commands.play.autocomplete.noVoiceChannel,
            value: "noVoice",
          },
        ]);

      const query = interaction.getInput();
      if (!query)
        return interaction.respond([
          {
            name: messages.commands.play.autocomplete.noQuery,
            value: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
          },
        ]);

      const tracks = await client.manager.search(query, searchEngine);
      if (!tracks.length)
        return interaction.respond([
          {
            name: messages.commands.play.autocomplete.noTracks,
            value: "noTracks",
          },
        ]);

      await interaction.respond(
        tracks.slice(0, 25).map((track) => {
          const duration = track.info.isStream
            ? messages.commands.play.live
            : parseTime(track.info.duration) ??
              messages.commands.play.undetermined;

          return {
            name: `${sliceText(
              track.info.title,
              20
            )} (${duration}) - ${sliceText(track.info.author, 30)}`,
            value: track.info.uri!,
          };
        })
      );
    },
  }),
};

@Declare({
  name: "play",
  description: "Play music with Mirai.",
  aliases: ["p"],
  integrationTypes: ["GuildInstall"],
  contexts: ["Guild"],
})
@MiraiOptions({ cooldown: 5, inVoice: true, sameVoice: true, checkNodes: true })
@Options(options)
@LocalesT("locales.play.name", "locales.play.description")
export default class PlayCommand extends Command {
  async run(
    ctx: CommandContext<typeof options>
  ): Promise<Message | WebhookMessage | void> {
    const { options, client, guildId, channelId, member, author } = ctx;
    const { query } = options;

    if (!(guildId && member)) return;

    const voice = await member.voice()?.channel();
    if (!voice?.is(["GuildVoice", "GuildStageVoice"])) return;

    let bot = ctx.me()?.voice();
    if (bot && bot.channelId !== voice.id) return;

    const { messages } = await ctx.getLocale();
    const { defaultVolume, searchEngine } = await client.database.getPlayer(
      guildId
    );

    await ctx.deferReply();

    const player = client.manager.createPlayer({
      guildId: guildId,
      textChannelId: channelId,
      voiceChannelId: voice.id,
      volume: defaultVolume,
      selfDeaf: true,
    });

    if (!player.connected) await player.connect();

    await player.node.updateSession(true, client.config.resumeTime);

    const { loadType, playlist, tracks } = await player.search(
      { query, source: searchEngine },
      author
    );

    player.set("commandContext", ctx);

    if (!bot) bot = client.cache.voiceStates?.get(client.me.id, guildId);
    if (voice.isStage() && bot?.suppress) await bot.setSuppress(false);

    switch (loadType) {
      case "empty":
      case "error":
        {
          if (!player.queue.current) await player.destroy();

          await ctx.editOrReply({
            flags: MessageFlags.Ephemeral,
            content: "",
            embeds: [
              {
                color: EmbedColors.Red,
                description: messages.commands.play.noResults,
              },
            ],
          });
        }
        break;

      case "track":
      case "search":
        {
          const track = tracks[0];

          if (player.get("enabledAutoplay")) await player.queue.add(track, 0);
          else await player.queue.add(track);

          const type = player.queue.tracks.length > 1 ? "results" : "result";
          const status = track.info.isStream
            ? messages.commands.play.live
            : parseTime(track.info.duration) ??
              messages.commands.play.undetermined;

          const embed = new Embed()
            .setThumbnail(track.info.artworkUrl ?? "")
            .setColor(client.config.color.success)
            .setDescription(
              messages.commands.play.embed[type]({
                duration: status,
                position:
                  player.queue.tracks.findIndex(
                    (t) => t.info.identifier === track.info.identifier
                  ) + 1,
                requester: (track.requester as User).id,
                title: track.info.title,
                url: track.info.uri!,
                volume: player.volume,
              })
            )
            .setTimestamp();

          await ctx.editOrReply({
            content: "",
            embeds: [embed],
          });

          if (!player.playing) await player.play();
        }
        break;

      case "playlist":
        {
          const track = tracks[0];

          if (player.get("enabledAutoplay")) await player.queue.add(tracks, 0);
          else await player.queue.add(tracks);

          const embed = new Embed()
            .setColor(client.config.color.success)
            .setThumbnail(track.info.artworkUrl ?? "")
            .setDescription(
              messages.commands.play.embed.playlist({
                query,
                playlist: playlist?.name ?? playlist?.title ?? track.info.title,
                requester: (track.requester as User).id,
                tracks: tracks.length,
                volume: player.volume,
              })
            )
            .setTimestamp();

          await ctx.editOrReply({
            content: "",
            embeds: [embed],
          });

          if (!player.playing) await player.play();
        }
        break;
    }
  }
}
