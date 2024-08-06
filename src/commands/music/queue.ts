import {
  Command,
  type CommandContext,
  Declare,
  Embed,
  LocalesT,
  type User,
} from "seyfert";
import { MiraiOptions } from "#mirai/decorators";

import { EmbedPaginator } from "#mirai/utils/Paginator.js";

@Declare({
  name: "queue",
  description: "See the queue.",
  integrationTypes: ["GuildInstall"],
  contexts: ["Guild"],
})
@MiraiOptions({
  cooldown: 5,
  checkPlayer: true,
  inVoice: true,
  sameVoice: true,
  checkNodes: true,
})
@LocalesT("locales.queue.name", "locales.queue.description")
export default class QueueCommand extends Command {
  async run(ctx: CommandContext) {
    const { client, guildId, author } = ctx;

    if (!guildId) return;

    const { messages } = await ctx.getLocale();

    const player = client.manager.getPlayer(guildId);
    if (!player) return;

    const tracksPerPage = 20;
    const paginator = new EmbedPaginator(ctx);
    const tracks = player.queue.tracks.map(
      (track, i) =>
        `#${i + 1}. [\`${track.info.title}\`](${track.info.uri}) - ${
          (track.requester as User).tag
        }`
    );

    if (tracks.length < tracksPerPage) {
      await ctx.editOrReply({
        embeds: [
          new Embed()
            .setDescription(
              messages.events.playerQueue({
                tracks: tracks.slice(0, tracksPerPage).join("\n"),
              })
            )
            .setColor(client.config.color.extra)
            .setThumbnail(ctx.guild()!.iconURL())
            .setTimestamp()
            .setAuthor({ name: author.tag, iconUrl: author.avatarURL() }),
        ],
      });
    } else {
      for (let i = 0; i < tracks.length; i += tracksPerPage) {
        paginator.addEmbed(
          new Embed()
            .setDescription(
              messages.events.playerQueue({
                tracks: tracks.slice(i, i + tracksPerPage).join("\n"),
              })
            )
            .setColor(client.config.color.extra)
            .setThumbnail(ctx.guild()!.iconURL())
            .setTimestamp()
            .setAuthor({ name: author.tag, iconUrl: author.avatarURL() })
        );

        await paginator.reply();
      }
    }
  }
}
