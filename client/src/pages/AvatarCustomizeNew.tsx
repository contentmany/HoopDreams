import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarSVG, type AvatarDNA } from "@/avatar/AvatarRenderer";
import { HAIR, type HairStyleId } from "@/avatar/AvatarKit";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

interface AvatarCustomizeNewProps {
  onNavigate?: (path: string) => void;
}

const hairOrder: HairStyleId[] = [
  "bald",
  "buzz_fade",
  "waves",
  "short_curls",
  "braids_box",
  "twists_two_strand",
  "locs_medium",
];

const hairColorOptions = [
  { key: "black", label: "Black" },
  { key: "deep_brown", label: "Deep Brown" },
  { key: "brown", label: "Brown" },
  { key: "dark_blond", label: "Dark Blond" },
] as const;

const skinToneOptions: { key: AvatarDNA["skinTone"]; label: string }[] = [
  { key: "light", label: "Light" },
  { key: "tan", label: "Tan" },
  { key: "brown", label: "Brown" },
  { key: "deep", label: "Deep" },
];

const eyeColorOptions: { key: AvatarDNA["eyes"]; label: string }[] = [
  { key: "brown", label: "Brown" },
  { key: "hazel", label: "Hazel" },
  { key: "blue", label: "Dark Blue" },
  { key: "green", label: "Green" },
];

const eyeShapeOptions: { key: NonNullable<AvatarDNA["eyeShape"]>; label: string }[] = [
  { key: "round", label: "Round" },
  { key: "almond", label: "Almond" },
  { key: "sleepy", label: "Sleepy" },
];

const mouthOptions: { key: NonNullable<AvatarDNA["mouth"]>; label: string }[] = [
  { key: "neutral", label: "Neutral" },
  { key: "smile", label: "Smile" },
  { key: "frown", label: "Frown" },
  { key: "smirk", label: "Smirk" },
];

const facialOptions: { key: AvatarDNA["facialHair"]; label: string }[] = [
  { key: "none", label: "None" },
  { key: "goatee_small", label: "Goatee" },
  { key: "goatee_full", label: "Full Goatee" },
  { key: "mustache_thin", label: "Mustache" },
];

const defaultDNA: AvatarDNA = {
  skinTone: "tan",
  hairStyle: "buzz_fade",
  hairColor: "black",
  brows: "on",
  facialHair: "none",
  eyes: "brown",
  eyeShape: "round",
  mouth: "neutral",
};

const randomItem = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

function makeRandomDNA(): AvatarDNA {
  return {
    skinTone: randomItem(skinToneOptions.map((opt) => opt.key)),
    hairStyle: randomItem(hairOrder),
    hairColor: randomItem(hairColorOptions.map((opt) => opt.key)),
    brows: Math.random() > 0.12 ? "on" : "off",
    facialHair: randomItem(facialOptions.map((opt) => opt.key)),
    eyes: randomItem(eyeColorOptions.map((opt) => opt.key)),
    eyeShape: randomItem(eyeShapeOptions.map((opt) => opt.key)),
    mouth: randomItem(mouthOptions.map((opt) => opt.key)),
  };
}

export default function AvatarCustomizeNew({ onNavigate }: AvatarCustomizeNewProps) {
  const [, setLocation] = useLocation();
  const [dna, setDna] = useState<AvatarDNA>(defaultDNA);

  const handleSelect = <K extends keyof AvatarDNA>(key: K) =>
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setDna((current) => ({ ...current, [key]: event.target.value as AvatarDNA[K] }));
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
                onClick={() => {
                  onNavigate?.("/new");
                  setLocation("/new");
                }}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>Customize Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <style>{`
  .avatar-wrap{display:flex;flex-direction:column;gap:.75rem;max-width:360px}
  .avatar-stage{width:320px;height:320px;border-radius:18px;overflow:hidden;background:#2a2320;display:flex;align-items:center;justify-content:center}
  .controls{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
  .controls label{display:flex;flex-direction:column;font-size:.9rem;gap:.25rem}
  .controls select{background:#1f1a17;color:#fff;border:1px solid #3a2f2a;border-radius:8px;padding:.35rem .5rem}
            `}</style>

            <div className="avatar-wrap">
              <div className="avatar-stage" aria-label="avatar preview">
                <AvatarSVG dna={dna} />
              </div>

              <div className="controls">
                <label>
                  Skin
                  <select value={dna.skinTone} onChange={handleSelect("skinTone")}>
                    {skinToneOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Hair
                  <select value={dna.hairStyle} onChange={handleSelect("hairStyle")}>
                    {hairOrder.map((id) => (
                      <option key={id} value={id}>
                        {HAIR[id].label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Hair Color
                  <select value={dna.hairColor} onChange={handleSelect("hairColor")}>
                    {hairColorOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Eye Color
                  <select value={dna.eyes} onChange={handleSelect("eyes")}>
                    {eyeColorOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Eye Shape
                  <select value={dna.eyeShape} onChange={handleSelect("eyeShape")}>
                    {eyeShapeOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Mouth
                  <select value={dna.mouth} onChange={handleSelect("mouth")}>
                    {mouthOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Brows
                  <select value={dna.brows} onChange={handleSelect("brows")}>
                    <option value="on">On</option>
                    <option value="off">Off</option>
                  </select>
                </label>

                <label>
                  Facial Hair
                  <select value={dna.facialHair} onChange={handleSelect("facialHair")}>
                    {facialOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex justify-end">
                <Button variant="secondary" onClick={() => setDna(makeRandomDNA())}>
                  Randomize
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
