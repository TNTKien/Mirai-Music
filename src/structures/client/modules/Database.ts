import { PrismaClient } from "@prisma/client";

import type { SearchPlatform } from "lavalink-client";
import type { UsingClient } from "seyfert";

import { Configuration } from "#mirai/data/Configuration.js";

//🗿
const prismaClient = new PrismaClient();

//TODO: Add a database cache to make less requests to the database.

/**
 * Main Mirai database class.
 */
export class MiraiDatabase {
  private client: UsingClient;
  private prisma!: PrismaClient;

  private connected: boolean = false;

  /**
   *
   * Create a instance of the database.
   * @param client
   */
  constructor(client: UsingClient) {
    this.client = client;

    //cuz prisma makes weird stuff
    //credits: NoBody-UU for the tip
    Object.defineProperty(this, "prisma", {
      get: () => prismaClient,
    });
  }

  /**
   * Return if Mirai is connected to the Database.
   */
  public get isConnected(): boolean {
    return this.connected;
  }

  /**
   * Connect Mirai to the database.
   */
  public async connect(): Promise<void> {
    await this.prisma
      .$connect()
      .then(() => {
        this.connected = true;
        this.client.logger.info(
          "Database - Mirai is now connected to the database."
        );
      })
      .catch((error) => this.client.logger.error(`Database - ${error}`));
  }

  /**
   *
   * Get the guild locale from the database.
   * @param guildId
   * @returns
   */
  public async getLocale(guildId: string): Promise<string> {
    const data = await this.prisma.guildLocale.findUnique({
      where: { id: guildId },
    });
    return data?.locale ?? this.client.config.defaultLocale;
  }

  /**
   *
   * Get the guild prefix from the database.
   * @param guildId
   * @returns
   */
  public async getPrefix(guildId: string): Promise<string> {
    const data = await this.prisma.guildPrefix.findUnique({
      where: { id: guildId },
    });
    return data?.prefix ?? this.client.config.defaultPrefix;
  }

  /**
   *
   * Get the guild player from the database.
   * @param guildId
   * @returns
   */
  public async getPlayer(
    guildId: string
  ): Promise<Pick<NonNullable<PlayerData>, "defaultVolume" | "searchEngine">> {
    const data = await this.prisma.guildPlayer.findUnique({
      where: { id: guildId },
    });
    return {
      defaultVolume: data?.defaultVolume ?? Configuration.defaultVolume,
      searchEngine:
        (data?.searchEngine as SearchPlatform | null | undefined) ??
        Configuration.defaultSearchEngine,
    };
  }

  /**
   *
   * Set the guild locale to the database.
   * @param guildId
   * @param locale
   */
  public async setLocale(guildId: string, locale: string): Promise<void> {
    await this.prisma.guildLocale.upsert({
      where: { id: guildId },
      update: { locale },
      create: {
        id: guildId,
        locale,
      },
    });
  }

  /**
   *
   * Set the guild prefix to the database.
   * @param guildId
   * @param prefix
   */
  public async setPrefix(guildId: string, prefix: string): Promise<void> {
    await this.prisma.guildPrefix.upsert({
      where: { id: guildId },
      update: { prefix },
      create: {
        id: guildId,
        prefix,
      },
    });
  }

  /**
   *
   * Set the guild player to the database.
   * @param param0
   * @returns
   */
  public async setPlayer({
    guildId,
    defaultVolume,
    searchEngine,
  }: PlayerData): Promise<void> {
    const data = await this.getPlayer(guildId);

    defaultVolume ??= data.defaultVolume;
    searchEngine ??= data.searchEngine;

    await this.prisma.guildPlayer.upsert({
      where: { id: guildId },
      update: { defaultVolume, searchEngine },
      create: { id: guildId, defaultVolume, searchEngine },
    });
  }
}

interface PlayerData {
  guildId: string;
  searchEngine?: SearchPlatform;
  defaultVolume?: number;
}
