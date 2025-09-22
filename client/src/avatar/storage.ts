import { type AvatarDNA } from "./types";
import {
  AVATAR_EVENT,
  AVATAR_STORAGE_KEY,
  loadAvatarDNA,
  saveAvatarDNA,
  clearAvatarDNA,
} from "./helpers";

export const DNA_STORAGE_KEY = AVATAR_STORAGE_KEY;
export const DNA_CHANGED_EVENT = AVATAR_EVENT;

export function loadDNA(): AvatarDNA {
  return loadAvatarDNA();
}

export function saveDNA(dna: AvatarDNA): void {
  saveAvatarDNA(dna);
}

export function clearDNA(): void {
  clearAvatarDNA();
}
