export const POSITION_ARCHETYPES = {
  PG: ["Pass First", "Shot Creator", "3&D", "Slasher"],
  SG: ["Shot Creator", "3&D", "Slasher"],
  SF: ["3&D", "Slasher", "Shot Creator", "Stretch Big"],
  PF: ["Stretch Big", "Rim Protector", "3&D", "Slasher"],
  C: ["Rim Protector", "Stretch Big"]
} as const;

export type Position = keyof typeof POSITION_ARCHETYPES;
export type Archetype = typeof POSITION_ARCHETYPES[Position][number];

export function getArchetypesForPosition(position: Position): string[] {
  return [...(POSITION_ARCHETYPES[position] || [])];
}

export function isValidArchetypeForPosition(position: Position, archetype: string): boolean {
  return getArchetypesForPosition(position).includes(archetype);
}