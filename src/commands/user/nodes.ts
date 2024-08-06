import {
  Command,
  type CommandContext,
  Declare,
  Embed,
  LocalesT,
} from "seyfert";

import { MiraiOptions } from "#mirai/decorators";

import { EmbedColors } from "seyfert/lib/common/index.js";

import { EmbedPaginator } from "#mirai/utils/Paginator.js";
import { msParser } from "#mirai/utils/functions/utils.js";

@Declare({
  name: "nodes",
  description: "Get the status of all Mirai nodes.",
  integrationTypes: ["GuildInstall"],
  contexts: ["Guild"],
})
@MiraiOptions({ cooldown: 5 })
@LocalesT("locales.nodes.name", "locales.nodes.description")
export default class ExampleCommand extends Command {
  async run(ctx: CommandContext) {
    const { client } = ctx;
    const { messages } = await ctx.getLocale();

    const pages = new EmbedPaginator(ctx);
    const maxFields = 25;
    const fields = client.manager.nodeManager.nodes.map((node, i) => ({
      name: `\`🔰\` ${node.id} - #${i + 1}`,
      inline: true,
      value: messages.commands.nodes.value({
        state:
          messages.commands.nodes.states[
            node.connected ? "connected" : "disconnected"
          ],
        players: node.stats.players,
        uptime: msParser(node.stats.uptime),
      }),
    }));

    if (!fields.length)
      return ctx.editOrReply({
        embeds: [
          {
            description: messages.commands.nodes.noNodes,
            color: EmbedColors.Red,
          },
        ],
      });

    if (fields.length < maxFields) {
      await ctx.editOrReply({
        embeds: [
          new Embed()
            .setDescription(messages.commands.nodes.description)
            .setColor(client.config.color.success)
            .addFields(fields.slice(0, maxFields))
            .setTimestamp(),
        ],
      });
    } else {
      for (let i = 0; fields.length < maxFields; i += maxFields) {
        pages.addEmbed(
          new Embed()
            .setDescription(messages.commands.nodes.description)
            .setColor(client.config.color.success)
            .addFields(fields.slice(i, i + maxFields))
            .setTimestamp()
        );
      }

      await pages.reply();
    }
  }
}
