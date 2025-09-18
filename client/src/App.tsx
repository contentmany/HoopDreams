import React from "react";
import { PixelAvatar } from "./pixel/PixelAvatar";
import { HAIR_SET } from "./pixel/hairSet";
import { SKIN, HAIR as HAIR_PAL } from "./pixel/palettes";

const keys = <T extends object>(o: T) => Object.keys(o) as (keyof T)[];

export default function App() {
  const skinOptions = keys(SKIN);
  const hairColorOptions = keys(HAIR_PAL);

  const [skin, setSkin] = React.useState<typeof skinOptions[number]>("tan");
  const [hairId, setHairId] = React.useState<string>(HAIR_SET[0]?.id ?? "dreads_medium");
  const [hairColor, setHairColor] = React.useState<typeof hairColorOptions[number]>("dark");

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 24, display: "grid", gap: 24 }}>
      <h2 style={{ margin: 0 }}>Customize Player</h2>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, alignItems: "start" }}>
        <div style={{ padding: 16, background: "#121212", borderRadius: 12, width: 200 }}>
          <PixelAvatar size={160} skin={skin} hairId={hairId} hairColor={hairColor} />
        </div>

        <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Skin</span>
            <select value={skin} onChange={(e) => setSkin(e.target.value as any)}>
              {skinOptions.map((k) => (
                <option key={String(k)} value={String(k)}>{String(k)}</option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Hair Style</span>
            <select value={hairId} onChange={(e) => setHairId(e.target.value)}>
              {HAIR_SET.map((h) => (
                <option key={h.id} value={h.id}>{h.label}</option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Hair Color</span>
            <select value={hairColor} onChange={(e) => setHairColor(e.target.value as any)}>
              {hairColorOptions.map((k) => (
                <option key={String(k)} value={String(k)}>{String(k)}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
