import { readFile } from "node:fs/promises";
import { getFlag } from "#mirai/utils/functions/utils.js";

import type { RepeatMode } from "lavalink-client";
import {
  ActivityType,
  type GatewayActivityUpdateData,
} from "seyfert/lib/types/index.js";
import type { AutoplayMode, PausedMode } from "#mirai/types";

const packageJSON = JSON.parse(await readFile("./package.json", "utf-8"));

/**
 * Mirai version.
 */
export const BOT_VERSION: string = packageJSON.version;

/**
 * Check if Mirai is running un DEBUG MODE.
 */
export const DEBUG_MODE: boolean = getFlag("--debug");

/**
 * Mirai eval secrets regex.
 */
export const SECRETS_REGEX =
  /\b(?:client\.(?:config)|config|env|process\.env|eval|atob|btoa)\b/;

/**
 *
 * Mirai autoplay state.
 * @param boolean
 * @returns
 */
export const AUTOPLAY_STATE = (boolean: boolean) => {
  const states: Record<string, AutoplayMode> = {
    true: "enabled",
    false: "disabled",
  };
  return states[String(boolean)];
};

/**
 *
 * Mirai pause state.
 * @param boolean
 * @returns
 */
export const PAUSE_STATE = (boolean: boolean) => {
  const states: Record<string, PausedMode> = {
    true: "resume",
    false: "pause",
  };
  return states[String(boolean)];
};

/**
 *
 * Mirai loop state.
 * @param mode
 * @param alt
 * @returns
 */
export const LOOP_STATE = (mode: RepeatMode, alt?: boolean) => {
  const states: Record<RepeatMode, RepeatMode> = {
    off: "track",
    track: "queue",
    queue: "off",
  };

  if (alt) {
    states.off = "off";
    states.track = "track";
    states.queue = "queue";
  }

  return states[mode];
};

/**
 * Mirai think messages.
 */
export const THINK_MESSAGES: string[] = [
  "is thinking...",
  "is stargazing...",
  "is astral pondering...",
  "is charting a course...",
  "is cosmic contemplating...",
  "is navigating the cosmos...",
  "is starbound thinking...",
  "is exploring the void...",
  "is celestial pondering...",
  "is interstellar musing...",
  "is star searching...",
  "is galactic contemplating...",
  "is stellar considering...",
  "is spacebound reflecting...",
  "is nebulae pondering...",
  "is lunar musing...",
];

/**
 * Mirai eval secrets messages.
 */
export const SECRETS_MESSAGES: string[] = [
  "That's... restricted information...",
  "Hey! You can't see that.",
  "Don't you have better things to do?",
  "No, I won't let you see that...",
  "That information, is private...",
  "Hey! Mind your business...",
  "I'm getting bored of this....",
  "ENOUGH!",
  "I'm serious... I'm tired...",
  "...",
  "I will restrict you if you continue...",
];

/**
 * Mirai presence activities.
 */
export const BOT_ACTIVITIES: GatewayActivityUpdateData[] = [
  { name: "the Space. 🌠", type: ActivityType.Listening },
  { name: `v${BOT_VERSION}. 🐐`, type: ActivityType.Listening },
  { name: "with {users} users. 🎧", type: ActivityType.Listening },
  { name: "in {guilds} guilds. ❤️", type: ActivityType.Streaming },
  { name: "with {users} users. 👤", type: ActivityType.Playing },
  { name: "{players} players. 🌐", type: ActivityType.Watching },
];
