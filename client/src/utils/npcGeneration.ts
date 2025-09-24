import { CharacterLook, SKIN_OPTIONS, HAIR_OPTIONS, BROW_OPTIONS, EYE_OPTIONS, NOSE_OPTIONS, MOUTH_OPTIONS, ACCESSORY_OPTIONS } from '@/types/character';

/**
 * Simple seedable random number generator using LCG (Linear Congruential Generator)
 * This ensures deterministic character generation for NPCs
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    // LCG formula: (a * seed + c) % m
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: readonly T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

/**
 * Generates a deterministic character look based on a string seed
 * Same seed will always produce the same character appearance
 */
export function generateNPCCharacterLook(seed: string): CharacterLook {
  // Convert string seed to numeric seed
  let numericSeed = 0;
  for (let i = 0; i < seed.length; i++) {
    numericSeed = ((numericSeed << 5) - numericSeed + seed.charCodeAt(i)) & 0xffffffff;
  }
  
  const rng = new SeededRandom(Math.abs(numericSeed));

  // Generate random features using seeded RNG
  const skin = rng.choice(SKIN_OPTIONS);
  const hair = rng.choice(HAIR_OPTIONS);
  const brows = rng.choice(BROW_OPTIONS);
  const eyes = rng.choice(EYE_OPTIONS);
  const nose = rng.choice(NOSE_OPTIONS);
  const mouth = rng.choice(MOUTH_OPTIONS);
  const accessory = rng.choice(ACCESSORY_OPTIONS);
  
  // Random team colors
  const jerseyColors = ['#7A5BFF', '#38E1C6', '#FF6B35', '#4CAF50', '#E91E63', '#FF9800', '#9C27B0', '#2196F3'];
  const jerseyColor = rng.choice(jerseyColors);
  const teamNumber = rng.nextInt(1, 99);

  return {
    skin,
    hair,
    brows,
    eyes,
    nose,
    mouth,
    accessory,
    jerseyColor,
    shortsColor: jerseyColor, // Use same color for simplicity
    teamNumber
  };
}

/**
 * Generates multiple NPC characters with unique seeds
 * Useful for creating teams or groups of NPCs
 */
export function generateNPCTeam(teamName: string, playerCount: number = 12): CharacterLook[] {
  const characters: CharacterLook[] = [];
  
  for (let i = 0; i < playerCount; i++) {
    const seed = `${teamName}_player_${i}`;
    characters.push(generateNPCCharacterLook(seed));
  }
  
  return characters;
}

/**
 * Generates an opponent player with a specific jersey number and team colors
 * Maintains deterministic generation while allowing customization
 */
export function generateOpponentPlayer(
  playerName: string, 
  teamColors: { jersey: string; shorts: string },
  jerseyNumber?: number
): CharacterLook {
  const baseLook = generateNPCCharacterLook(playerName);
  
  return {
    ...baseLook,
    jerseyColor: teamColors.jersey,
    shortsColor: teamColors.shorts,
    teamNumber: jerseyNumber || baseLook.teamNumber
  };
}

/**
 * Generates a random character look using Math.random (non-deterministic)
 * Useful for true random generation when determinism isn't needed
 */
export function generateRandomCharacterLook(): CharacterLook {
  const seed = Date.now().toString() + Math.random().toString();
  return generateNPCCharacterLook(seed);
}

/**
 * Predefined character seeds for consistent NPCs across game sessions
 * These can be used for important story characters or recurring NPCs
 */
export const PRESET_NPC_SEEDS = {
  // Coaches
  COACH_WILLIAMS: 'coach_williams_veteran',
  COACH_MARTINEZ: 'coach_martinez_young',
  COACH_THOMPSON: 'coach_thompson_strict',
  
  // Rival players
  RIVAL_ACE: 'rival_ace_basketball',
  RIVAL_SPEEDSTER: 'rival_speedster_fast',
  RIVAL_POWERHOUSE: 'rival_powerhouse_strong',
  
  // Teammates
  TEAMMATE_LEADER: 'teammate_leader_captain',
  TEAMMATE_ROOKIE: 'teammate_rookie_fresh',
  TEAMMATE_VETERAN: 'teammate_veteran_wise'
} as const;

/**
 * Gets a preset NPC character look
 */
export function getPresetNPCLook(presetKey: keyof typeof PRESET_NPC_SEEDS): CharacterLook {
  return generateNPCCharacterLook(PRESET_NPC_SEEDS[presetKey]);
}