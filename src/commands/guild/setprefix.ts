import {
  Command,
  type CommandContext,
  Declare,
  LocalesT,
  Options,
  createStringOption,
} from "seyfert";
import { MiraiOptions } from "#mirai/decorators";

const options = {
  prefix: createStringOption({
    description: "Enter the new prefix.",
    required: true,
    locales: {
      name: "locales.setprefix.option.name",
      description: "locales.setprefix.option.description",
    },
  }),
};

@Declare({
  name: "setprefix",
  description: "Set the prefix of Mirai.",
  integrationTypes: ["GuildInstall"],
  contexts: ["Guild"],
  defaultMemberPermissions: ["ManageGuild"],
})
@MiraiOptions({ cooldown: 10 })
@LocalesT("locales.setprefix.name", "locales.setprefix.description")
@Options(options)
export default class SetlangCommand extends Command {
  async run(ctx: CommandContext<typeof options>) {
    const { client, options } = ctx;
    const { prefix } = options;

    if (!ctx.guildId) return;

    const { messages } = await ctx.getLocale();

    await client.database.setPrefix(ctx.guildId, prefix);
    await ctx.editOrReply({
      embeds: [
        {
          description: messages.commands.setprefix({ prefix }),
          color: client.config.color.success,
        },
      ],
    });
  }
}
