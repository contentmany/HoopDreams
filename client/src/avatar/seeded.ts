import { type AvatarDNA } from "./types";
import { randomizeAvatar } from "./helpers";

export function randomDNA(seed?: string): AvatarDNA {
  return randomizeAvatar(seed);
}

export function avatarFromId(id: string): AvatarDNA {
  return randomizeAvatar(id || "guest");
}
