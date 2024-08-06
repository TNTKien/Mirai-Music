import { BaseHandler } from "seyfert/lib/common/index.js";
import { Lavalink } from "./Lavalink.js";

import type { Mirai } from "#mirai/client";

/**
 * Main Mirai music handler.
 */
export class MiraiHandler extends BaseHandler {
  readonly client: Mirai;

  /**
   *
   * Create a new instance of the handler.
   * @param client
   */
  constructor(client: Mirai) {
    super(client.logger);
    this.client = client;
  }

  /**
   * Load the handler.
   */
  public async load() {
    const files = await this.loadFilesK<{ default: Lavalink }>(
      await this.getFiles(await this.client.getRC().then((x) => x.lavalink))
    );

    for await (const file of files) {
      const path = file.path.split(process.cwd()).slice(1).join(process.cwd());
      const event: Lavalink = file.file.default;

      if (!(event && event instanceof Lavalink)) {
        this.logger.warn(
          `${path} doesn't export by \`export default new Lavaink({ ... })\``
        );
        continue;
      }

      if (!event.name) {
        this.logger.warn(`${path} doesn't have a \`name\``);
        continue;
      }

      if (typeof event.run !== "function") {
        this.logger.warn(`${path} doesn't have a \`run\` function`);
        continue;
      }

      const run = (...args: any) => event.run(this.client, ...args);

      if (event.isNode()) this.client.manager.nodeManager.on(event.name, run);
      else if (event.isManager()) this.client.manager.on(event.name, run);
    }
  }

  /**
   *
   * Reload all `lavalink-client` events.
   * @returns
   */
  //well,.. this is weird, but works.
  reloadAll(): Promise<void> {
    this.client.manager.removeAllListeners();
    this.client.manager.nodeManager.removeAllListeners();
    return this.load();
  }
}
