import {
  Command,
  type CommandContext,
  Declare,
  Embed,
  LocalesT,
} from "seyfert";
import { MiraiOptions } from "#mirai/decorators";

@Declare({
  name: "ping",
  description: "Get the Mirai ping.",
  integrationTypes: ["GuildInstall"],
  contexts: ["Guild"],
})
@MiraiOptions({ cooldown: 5 })
@LocalesT("locales.ping.name", "locales.ping.description")
export default class PingCommand extends Command {
  async run(ctx: CommandContext): Promise<void> {
    const { client } = ctx;
    const { messages } = ctx.t.get();

    const embed = new Embed()
      .setColor(client.config.color.extra)
      .setDescription(messages.commands.ping.message)
      .setTimestamp();

    await ctx.editOrReply({ embeds: [embed] });

    const wsPing = Math.floor(client.gateway.latency);
    const clientPing = Math.floor(
      Date.now() - (ctx.message ?? ctx.interaction)!.createdTimestamp
    );
    const shardPing = Math.floor(
      (await ctx.client.gateway.get(ctx.shardId)?.ping()) ?? 0
    );

    embed
      .setColor(client.config.color.success)
      .setDescription(
        messages.commands.ping.response({ wsPing, clientPing, shardPing })
      );

    await ctx.editOrReply({ embeds: [embed] });
  }
}
