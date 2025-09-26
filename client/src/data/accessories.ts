import { Accessory } from '@/types/accessories';

export const ACCESSORIES: Accessory[] = [
  {
    id: "shooting-sleeve",
    name: "Shooting Sleeve",
    slot: "arm",
    boost: { shooting: 3 },
    games: 4,
    price: 300
  },
  {
    id: "grip-wristband", 
    name: "Grip Wristband",
    slot: "wrist",
    boost: { finishing: 2 },
    games: 3,
    price: 150
  },
  {
    id: "compression-leg-sleeve",
    name: "Compression Leg Sleeve",
    slot: "leg", 
    boost: { speed: 2, stamina: 1 },
    games: 5,
    price: 200
  },
  {
    id: "performance-headband",
    name: "Performance Headband",
    slot: "head",
    boost: { defense: 2 },
    games: 6,
    price: 100
  },
  {
    id: "court-vision-shoes",
    name: "Court Vision Shoes",
    slot: "shoes",
    boost: { playmaking: 3, speed: 1 },
    games: 8,
    price: 500
  }
];