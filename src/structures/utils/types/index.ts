import type {
  CommandContext,
  ComponentContext,
  MenuCommandContext,
  MessageCommandInteraction,
  ModalContext,
  UserCommandInteraction,
} from "seyfert";
import type {
  InternalRuntimeConfig,
  InternalRuntimeConfigHTTP,
} from "seyfert/lib/client/base.js";
import type { PermissionFlagsBits } from "seyfert/lib/types/index.js";

export { MiraiConfiguration } from "./client/MiraiConfiguration.js";
export {
  AllEvents,
  LavalinkEvent,
  LavalinkEventRun,
  LavalinkEventType,
} from "./client/MiraiLavalink.js";

export type MiraiRuntime = { locations: { lavalink: string } };
//literally just copied this because the types cry
export type InternalMiraiRuntime<
  T extends InternalRuntimeConfigHTTP | InternalRuntimeConfig =
    | InternalRuntimeConfigHTTP
    | InternalRuntimeConfig
> = { debug: boolean } & Omit<T, "locations" | "debug"> & {
    templates: string | undefined;
    langs: string | undefined;
    events: string | undefined;
    components: string | undefined;
    commands: string | undefined;
    base: string;
    output: string;
    lavalink: string;
  };

export type PermissionNames = keyof typeof PermissionFlagsBits;
export type AutoplayMode = "enabled" | "disabled";
export type PausedMode = "pause" | "resume";
export type InternalRuntime = InternalRuntimeConfigHTTP | InternalRuntimeConfig;
export type AnyContext =
  | CommandContext
  | MenuCommandContext<MessageCommandInteraction | UserCommandInteraction>
  | ComponentContext
  | ModalContext;

export interface Options {
  /** The cooldown. */
  cooldown?: number;
  /** Only the bot developer can use the command. */
  onlyDeveloper?: boolean;
  /** Only the guild owner cam use the command. */
  onlyGuildOwner?: boolean;
  /** Only a member in a voice channel can use the command. */
  inVoice?: boolean;
  /** Only a member on the same voice channel with Mirai will be able to use the command. */
  sameVoice?: boolean;
  /** Check if Mirai is connected atleast in one node. */
  checkNodes?: boolean;
  /** Check if a player exists in a guild. */
  checkPlayer?: boolean;
  /** Check if the player queue has more than one track. */
  checkQueue?: boolean;
  /** Check if the queue has two or more tracks. */
  moreTracks?: boolean;
  /** The command category. */
  category?: string;
}

export type NonCommandOptions = Omit<Options, "category">;
