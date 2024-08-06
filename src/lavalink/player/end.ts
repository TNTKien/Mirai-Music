import { Lavalink } from "#mirai/classes";

export default new Lavalink({
  name: "trackEnd",
  type: "manager",
  run: async (client, player) => {
    if (!player.textChannelId) return;

    const messageId = player.get<string | undefined>("messageId");
    if (!messageId) return;

    await client.messages
      .edit(messageId, player.textChannelId, { components: [] })
      .catch(() => null);
  },
});
