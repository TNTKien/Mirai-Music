import {
  Command,
  type CommandContext,
  Declare,
  type DefaultLocale,
  LocalesT,
  Options,
  createStringOption,
} from "seyfert";
import { MiraiOptions } from "#mirai/decorators";

import { MessageFlags } from "seyfert/lib/types/index.js";

const options = {
  locale: createStringOption({
    description: "Enter the new locale.",
    required: true,
    locales: {
      name: "locales.setlocale.option.name",
      description: "locales.setlocale.option.description",
    },
    autocomplete: async (interaction) => {
      const { client } = interaction;

      const locales = Object.entries<DefaultLocale>(client.langs!.values).map(
        ([value, l]) => ({
          name: `${l.metadata.name} [${
            l.metadata.emoji
          }] - ${l.metadata.traslators.join(", ")}`,
          value,
        })
      );

      await interaction.respond(locales.slice(0, 25));
    },
  }),
};

@Declare({
  name: "setlocale",
  description: "Set the locale of Mirai.",
  aliases: ["locale", "lang", "language"],
  integrationTypes: ["GuildInstall"],
  contexts: ["Guild"],
  defaultMemberPermissions: ["ManageGuild"],
})
@MiraiOptions({ cooldown: 10 })
@LocalesT("locales.setlocale.name", "locales.setlocale.description")
@Options(options)
export default class SetlangCommand extends Command {
  async run(ctx: CommandContext<typeof options>) {
    const { client, options } = ctx;
    const { locale } = options;

    if (!ctx.guildId) return;

    const { messages } = await ctx.getLocale();

    const locales = Object.keys(client.langs!.values);
    if (!locales.includes(locale))
      return ctx.editOrReply({
        flags: MessageFlags.Ephemeral,
        embeds: [
          {
            description: messages.commands.setlocale.invalidLocale({
              locale,
              available: locales.join(", "),
            }),
            color: client.config.color.success,
          },
        ],
      });

    await client.database.setLocale(ctx.guildId, locale);
    await ctx.editOrReply({
      flags: MessageFlags.Ephemeral,
      embeds: [
        {
          description: ctx.t
            .get(locale)
            .messages.commands.setlocale.newLocale({ locale }),
          color: client.config.color.success,
        },
      ],
    });
  }
}
