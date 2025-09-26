export type AccessorySlot = "wrist" | "arm" | "leg" | "head" | "shoes";

export interface Accessory {
  id: string;
  name: string;
  slot: AccessorySlot;
  boost: Partial<Record<string, number>>; // Partial attributes boost
  games: number;
  price?: number;
}

export interface AccessoryInstance {
  instanceId: string;
  accessoryId: string;
  equipped: boolean;
  gamesRemaining: number;
  acquiredISO: string;
}