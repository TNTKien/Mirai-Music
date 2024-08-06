import {
  ActionRow,
  Button,
  ComponentCommand,
  type ComponentContext,
} from "seyfert";
import { MiraiOptions } from "#mirai/decorators";

import {
  type APIButtonComponentWithCustomId,
  ButtonStyle,
  ComponentType,
} from "seyfert/lib/types/index.js";

import { AUTOPLAY_STATE } from "#mirai/data/Constants.js";

@MiraiOptions({
  inVoice: true,
  sameVoice: true,
  checkPlayer: true,
  moreTracks: true,
  cooldown: 5,
  checkNodes: true,
})
export default class AutoplayComponent extends ComponentCommand {
  componentType = "Button" as const;

  filter(ctx: ComponentContext<typeof this.componentType>): boolean {
    return ctx.customId === "player-toggleAutoplay";
  }

  async run(ctx: ComponentContext<typeof this.componentType>) {
    const { client, guildId } = ctx;

    if (!guildId) return;

    const { messages } = await ctx.getLocale();

    const player = client.manager.getPlayer(guildId);
    if (!player) return;

    player.set("enabledAutoplay", !player.get("enabledAutoplay") ?? true);

    const isAutoplay = player.get<boolean>("enabledAutoplay");

    const components = ctx.interaction.message.components[0].toJSON();
    const newComponents = ctx.interaction.message.components[1].toJSON();

    const row = new ActionRow<Button>().setComponents(
      components.components.map(
        (button) => new Button(button as APIButtonComponentWithCustomId)
      )
    );
    const newRow = new ActionRow<Button>().setComponents(
      newComponents.components
        .filter(
          (row) =>
            row.type === ComponentType.Button && row.style !== ButtonStyle.Link
        )
        .map((button) => {
          if (
            (button as APIButtonComponentWithCustomId).custom_id ===
            "player-toggleAutoplay"
          )
            (button as APIButtonComponentWithCustomId).label =
              messages.events.playerStart.components.autoplay({
                type: messages.commands.autoplay.autoplayType[
                  AUTOPLAY_STATE(isAutoplay)
                ],
              });

          return new Button(button as APIButtonComponentWithCustomId);
        })
    );

    await ctx.interaction.message.edit({ components: [row, newRow] });
    await ctx.interaction.deferUpdate();
  }
}
