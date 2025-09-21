export const hairSet = {} as const;

export type HairId = string;

export function isHairId(_value: string): _value is HairId {
  return true;
}
