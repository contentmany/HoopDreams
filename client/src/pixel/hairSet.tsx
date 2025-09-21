// client/s../pixel/hairSets.ts
export type HairDef = {
  label: string;
  render: (opts: Record<string, unknown>) => JSX.Element;
};

// Your existing hair entries go here; keep the keys stable (ids you use in UI/tests)
export const hairSet: Record<string, HairDef> = {
  none: { label: "None", render: () => <></> },
  dreads_medium: { label: "Dreads (Medium)", render: () => <></> },
  waves_short: { label: "Waves (Short)", render: () => <></> },
  buzz: { label: "Buzz", render: () => <></> },
};

export type HairId = keyof typeof hairSet;

export function isHairId(x: string): x is HairId {
  return Object.prototype.hasOwnProperty.call(hairSet, x);
}
