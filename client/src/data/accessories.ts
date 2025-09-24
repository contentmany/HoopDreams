import type { Attributes } from '@/state/sim';

export interface Accessory {
  id: string;
  name: string;
  price: number;
  boost: { attr: keyof Attributes; amount: number };
  durationGames: number;
}

// Small catalog for now (empty visible shop, but define type)
export const ACCESSORIES: Record<string, Accessory> = {
  shootingBoots: {
    id: 'shootingBoots',
    name: 'Lucky Shooting Boots',
    price: 50,
    boost: { attr: 'shooting', amount: 5 },
    durationGames: 10
  },
  proteinShake: {
    id: 'proteinShake',
    name: 'Power Protein Shake',
    price: 30,
    boost: { attr: 'physicals', amount: 3 },
    durationGames: 5
  },
  defenseWristband: {
    id: 'defenseWristband', 
    name: 'Defense Focus Band',
    price: 40,
    boost: { attr: 'defense', amount: 4 },
    durationGames: 8
  }
};