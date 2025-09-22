import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PixelAvatar } from "@/avatar/PixelAvatar";
import {
  DEFAULT_DNA,
  type AvatarDNA,
  type BrowThickness,
  type EyeSpacing,
  type FacialHairId,
  type HairColor,
  type HairId,
  type Hairline,
  type HeadShape,
  type Nose,
  type SkinTone,
} from "@/avatar/types";
import { loadDNA, saveDNA } from "@/avatar/storage";
import { randomDNA } from "@/avatar/seeded";

interface AvatarCustomizeNewProps {
  onNavigate?: (path: string) => void;
}

const SKIN_OPTIONS: SkinTone[] = ["porcelain", "light", "tan", "brown", "deep"];
const HAIR_OPTIONS: HairId[] = ["buzzFade", "shortCurls", "boxBraids", "waves", "twistsShort"];
const HAIR_COLOR_OPTIONS: HairColor[] = ["black", "darkBrown", "brown", "blonde", "grey"];
const FACIAL_OPTIONS: FacialHairId[] = ["none", "mustache", "goatee", "fullBeard"];
const EYE_COLORS: AvatarDNA["eyeColor"][] = ["brown", "hazel", "green", "blue"];
const EYE_SHAPES: AvatarDNA["eyeShape"][] = ["round", "almond"];
const EYE_SPACING_OPTIONS: EyeSpacing[] = ["narrow", "normal", "wide"];
const MOUTHS: AvatarDNA["mouth"][] = ["neutral", "smile"];
const BROW_THICKNESS_OPTIONS: BrowThickness[] = ["thin", "medium", "thick"];
const HEAD_SHAPES: HeadShape[] = ["round", "oval", "square"];
const HAIRLINES: Hairline[] = ["low", "medium", "high"];
const NOSE_OPTIONS: Nose[] = ["small", "medium", "wide"];

const formatLabel = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());

export default function AvatarCustomizeNew({ onNavigate }: AvatarCustomizeNewProps) {
  const navigate = useNavigate();
  const [lastSaved, setLastSaved] = useState<AvatarDNA>(() => loadDNA());
  const [dna, setDna] = useState<AvatarDNA>(() => loadDNA());

  const savedChanged = useMemo(() => {
    return JSON.stringify(dna) !== JSON.stringify(lastSaved);
  }, [dna, lastSaved]);

  const update = <K extends keyof AvatarDNA>(key: K, value: AvatarDNA[K]) => {
    setDna((current) => ({ ...current, [key]: value }));
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleSave = () => {
    const next = { ...dna };
    saveDNA(next);
    setLastSaved(next);
    handleBack();
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Customize Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-8 md:grid-cols-[minmax(280px,1fr)_minmax(320px,1fr)] items-start">
              <div className="rounded-3xl bg-[#1d1b1a] p-6 flex items-center justify-center min-h-[360px]">
                <PixelAvatar size={256} dna={dna} />
              </div>

              <div className="grid gap-4">
                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Skin</span>
                  <select
                    value={dna.skin}
                    onChange={(event) => update("skin", event.target.value as SkinTone)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {SKIN_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Hair</span>
                  <select
                    value={dna.hair}
                    onChange={(event) => update("hair", event.target.value as HairId)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {HAIR_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Head Shape</span>
                  <select
                    value={dna.headShape ?? DEFAULT_DNA.headShape ?? "round"}
                    onChange={(event) => update("headShape", event.target.value as HeadShape)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {HEAD_SHAPES.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Hairline</span>
                  <select
                    value={dna.hairline ?? DEFAULT_DNA.hairline ?? "medium"}
                    onChange={(event) => update("hairline", event.target.value as Hairline)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {HAIRLINES.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Hair Color</span>
                  <select
                    value={dna.hairColor}
                    onChange={(event) => update("hairColor", event.target.value as HairColor)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {HAIR_COLOR_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Eye Color</span>
                  <select
                    value={dna.eyeColor}
                    onChange={(event) => update("eyeColor", event.target.value as AvatarDNA["eyeColor"])}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {EYE_COLORS.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Eye Shape</span>
                  <select
                    value={dna.eyeShape}
                    onChange={(event) => update("eyeShape", event.target.value as AvatarDNA["eyeShape"])}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {EYE_SHAPES.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Eye Spacing</span>
                  <select
                    value={dna.eyeSpacing ?? DEFAULT_DNA.eyeSpacing ?? "normal"}
                    onChange={(event) => update("eyeSpacing", event.target.value as EyeSpacing)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {EYE_SPACING_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Mouth</span>
                  <select
                    value={dna.mouth}
                    onChange={(event) => update("mouth", event.target.value as AvatarDNA["mouth"])}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {MOUTHS.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Nose Width</span>
                  <select
                    value={dna.nose ?? DEFAULT_DNA.nose ?? "medium"}
                    onChange={(event) => update("nose", event.target.value as Nose)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {NOSE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Brows</span>
                  <select
                    value={dna.brows ? "on" : "off"}
                    onChange={(event) => update("brows", event.target.value === "on")}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Brow Thickness</span>
                  <select
                    value={dna.browThickness ?? DEFAULT_DNA.browThickness ?? "medium"}
                    onChange={(event) => update("browThickness", event.target.value as BrowThickness)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {BROW_THICKNESS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Facial Hair</span>
                  <select
                    value={dna.facialHair}
                    onChange={(event) => update("facialHair", event.target.value as FacialHairId)}
                    className="rounded-lg border border-border bg-background px-3 py-2"
                  >
                    {FACIAL_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {formatLabel(option)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setDna({ ...DEFAULT_DNA })}>
                Reset
              </Button>
              <Button variant="outline" onClick={() => setDna(randomDNA())}>
                Randomize
              </Button>
              <Button
                variant="default"
                className="bg-[#ff6a00] text-white hover:bg-[#ff6a00]/90"
                onClick={handleSave}
                disabled={!savedChanged}
              >
                Save &amp; Continue
              </Button>
              <Button
                variant="ghost"
                onClick={() => setDna({ ...lastSaved })}
                disabled={!savedChanged}
              >
                Load Last Saved
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
