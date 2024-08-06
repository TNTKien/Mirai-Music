import { ComponentCommand, type ComponentContext } from "seyfert";
import { MiraiOptions } from "#mirai/decorators";

import { EmbedColors } from "seyfert/lib/common/index.js";
import { MessageFlags } from "seyfert/lib/types/index.js";

@MiraiOptions({
  inVoice: true,
  sameVoice: true,
  checkPlayer: true,
  cooldown: 5,
  checkNodes: true,
})
export default class PreviousTrackComponent extends ComponentCommand {
  componentType = "Button" as const;

  filter(ctx: ComponentContext<typeof this.componentType>): boolean {
    return ctx.customId === "player-previousTrack";
  }

  async run(ctx: ComponentContext<typeof this.componentType>) {
    const { client, guildId } = ctx;
    if (!guildId) return;

    const { messages } = await ctx.getLocale();

    const player = client.manager.getPlayer(guildId);
    if (!player) return;

    const track = player.queue.previous.shift();
    if (!track)
      return ctx.editOrReply({
        flags: MessageFlags.Ephemeral,
        embeds: [
          {
            description: messages.events.noPrevious,
            color: EmbedColors.Red,
          },
        ],
      });

    player.queue.add(track);

    await ctx.editOrReply({
      flags: MessageFlags.Ephemeral,
      embeds: [
        {
          description: messages.commands.previous({
            title: track.info.title,
            uri: track.info.uri!,
          }),
          color: client.config.color.success,
        },
      ],
    });
  }
}
