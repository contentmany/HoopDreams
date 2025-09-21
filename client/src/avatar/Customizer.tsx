import React, { useMemo, useState } from "react";
import { AvatarPreview } from "./AvatarPreview";
import {
  randomizeAvatar,
  saveAvatarDNA,
  loadAvatarDNA,
  clearAvatarDNA,
  normalizeDNA,
} from "./helpers";
import {
  type AvatarDNA,
  type SkinTone,
  type HairId,
  type HairColor,
  type FacialHairId,
  type EyeShape,
  type EyeSpacing,
  type BrowThickness,
  type HeadShape,
  type Hairline,
  type Nose,
} from "./types";

const option = <T extends string>(values: readonly T[]) =>
  values.map((value) => (
    <option key={value} value={value}>
      {value}
    </option>
  ));

const SKINS: SkinTone[] = ["porcelain", "light", "tan", "brown", "deep"];
const HAIRS: HairId[] = ["buzzFade", "shortCurls", "boxBraids", "waves", "twistsShort"];
const HAIR_COLORS: HairColor[] = ["black", "darkBrown", "brown", "blonde", "grey"];
const FACIAL: FacialHairId[] = ["none", "mustache", "goatee", "fullBeard"];
const EYE_COLORS: AvatarDNA["eyeColor"][] = ["brown", "hazel", "green", "blue"];
const EYE_SHAPES: EyeShape[] = ["round", "almond"];
const EYE_SPACING: EyeSpacing[] = ["narrow", "normal", "wide"];
const BROWS: BrowThickness[] = ["thin", "medium", "thick"];
const HEADS: HeadShape[] = ["round", "oval", "square"];
const HAIRLINES: Hairline[] = ["low", "medium", "high"];
const NOSES: Nose[] = ["small", "medium", "wide"];

export type AvatarCustomizerProps = {
  seed?: string;
};

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ seed }) => {
  const [dna, setDNA] = useState<AvatarDNA>(() => loadAvatarDNA());
  const previewDNA = useMemo(() => normalizeDNA(dna), [dna]);

  const set = <K extends keyof AvatarDNA>(key: K, value: AvatarDNA[K]) => {
    setDNA((current) => ({ ...current, [key]: value }));
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16 }}>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          padding: 12,
          background: "#1e1e1e",
          borderRadius: 8,
        }}
      >
        <AvatarPreview size={200} dna={previewDNA} />
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
          <label>
            Skin
            <select value={dna.skin} onChange={(event) => set("skin", event.target.value as SkinTone)}>
              {option(SKINS)}
            </select>
          </label>
          <label>
            Hair
            <select value={dna.hair} onChange={(event) => set("hair", event.target.value as HairId)}>
              {option(HAIRS)}
            </select>
          </label>
          <label>
            Hair Color
            <select value={dna.hairColor} onChange={(event) => set("hairColor", event.target.value as HairColor)}>
              {option(HAIR_COLORS)}
            </select>
          </label>
          <label>
            Facial Hair
            <select
              value={dna.facialHair}
              onChange={(event) => set("facialHair", event.target.value as FacialHairId)}
            >
              {option(FACIAL)}
            </select>
          </label>
          <label>
            Eye Color
            <select
              value={dna.eyeColor}
              onChange={(event) => set("eyeColor", event.target.value as AvatarDNA["eyeColor"])}
            >
              {option(EYE_COLORS)}
            </select>
          </label>
          <label>
            Eye Shape
            <select
              value={dna.eyeShape}
              onChange={(event) => set("eyeShape", event.target.value as EyeShape)}
            >
              {option(EYE_SHAPES)}
            </select>
          </label>
          <label>
            Eye Spacing
            <select
              value={dna.eyeSpacing ?? "normal"}
              onChange={(event) => set("eyeSpacing", event.target.value as EyeSpacing)}
            >
              {option(EYE_SPACING)}
            </select>
          </label>
          <label>
            Brow Thickness
            <select
              value={dna.browThickness ?? "medium"}
              onChange={(event) => set("browThickness", event.target.value as BrowThickness)}
            >
              {option(BROWS)}
            </select>
          </label>
          <label>
            Brows
            <select
              value={String(dna.brows ?? true)}
              onChange={(event) => set("brows", event.target.value === "true")}
            >
              <option value="true">on</option>
              <option value="false">off</option>
            </select>
          </label>
          <label>
            Mouth
            <select value={dna.mouth} onChange={(event) => set("mouth", event.target.value as AvatarDNA["mouth"])}>
              <option value="neutral">neutral</option>
              <option value="smile">smile</option>
            </select>
          </label>
          <label>
            Head Shape
            <select
              value={dna.headShape ?? "round"}
              onChange={(event) => set("headShape", event.target.value as HeadShape)}
            >
              {option(HEADS)}
            </select>
          </label>
          <label>
            Hairline
            <select
              value={dna.hairline ?? "medium"}
              onChange={(event) => set("hairline", event.target.value as Hairline)}
            >
              {option(HAIRLINES)}
            </select>
          </label>
          <label>
            Nose
            <select value={dna.nose ?? "medium"} onChange={(event) => set("nose", event.target.value as Nose)}>
              {option(NOSES)}
            </select>
          </label>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => setDNA(randomizeAvatar(seed))}>
            Randomize
          </button>
          <button type="button" onClick={() => setDNA(loadAvatarDNA())}>
            Reset
          </button>
          <button type="button" onClick={() => saveAvatarDNA(normalizeDNA(dna))}>
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              clearAvatarDNA();
              setDNA(loadAvatarDNA());
            }}
          >
            Clear
          </button>
        </div>

        <small style={{ opacity: 0.7 }}>
          Saving broadcasts <code>avatar:updated</code> so other views update instantly.
        </small>
      </div>
    </div>
  );
};
