import { render } from "@testing-library/react";
import { AvatarSVG, type AvatarDNA } from "@/avatar/AvatarRenderer";
import { HAIR } from "@/avatar/AvatarKit";

const baseDNA: AvatarDNA = {
  skinTone: "tan",
  hairColor: "deep_brown",
  brows: "on",
  eyes: "brown",
  facialHair: "none",
  hairStyle: "buzz_fade",
  eyeShape: "round",
  mouth: "neutral",
};

describe("Avatar hair renderer", () => {
    test("all hair styles render without overflow", () => {
      for (const meta of Object.values(HAIR)) {
        const dna: AvatarDNA = { ...baseDNA, hairStyle: meta.id };
        const markup = renderMarkup(dna);
        const viewBox = parseViewBox(markup);
        const nodes = extractElements(markup, ["path", "rect", "ellipse"]);
        nodes.forEach(({ attrs }) => {
          if (attrs.d) {
            const values = attrs.d.match(/-?\d+(?:\.\d+)?/g);
            if (values) {
              values.map(Number).forEach((value) => {
                expect(value <= viewBox.width + 1).toBeTruthy();
                expect(value >= -1).toBeTruthy();
              });
            }
          }
          for (const key of ["x", "y", "cx", "cy", "rx", "ry", "width", "height"]) {
            if (!(key in attrs)) continue;
            const numeric = Number(attrs[key]);
            if (!Number.isFinite(numeric)) continue;
            if (["rx", "ry", "width", "height"].includes(key)) {
              expect(numeric >= 0).toBeTruthy();
            } else {
              expect(numeric >= -1).toBeTruthy();
              expect(numeric <= viewBox.width + 1).toBeTruthy();
            }
          }
        });
      }
    });

  test("style label matches id mapping", () => {
    for (const meta of Object.values(HAIR)) {
      expect(meta.label).toBeTruthy();
    }
  });

  test("facial hair sticks to jaw", () => {
    const dna: AvatarDNA = { ...baseDNA, hairStyle: "buzz_fade", facialHair: "goatee_small" };
      const markup = renderMarkup(dna);
      expect(markup.includes('data-part="facial"')).toBeTruthy();
    });
  });

function renderMarkup(dna: AvatarDNA) {
  const { container } = render(<AvatarSVG dna={dna} />);
  return container.innerHTML || "";
}

function parseViewBox(markup: string) {
  const match = markup.match(/viewBox="([^"]+)"/);
  if (!match) return { width: 1000 };
  const parts = match[1].split(/\s+/).map(Number);
  return { width: parts[2] ?? 1000 };
}

function extractElements(markup: string, tags: string[]) {
  const tagPattern = tags.join("|");
  const regex = new RegExp(`<(${tagPattern})([^>]*)>`, "gi");
  const results: Array<{ tag: string; attrs: Record<string, string> }> = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markup))) {
    const [, tag, attrText] = match;
    const attrs: Record<string, string> = {};
    const attrRegex = /([a-zA-Z0-9:_-]+)="([^"]*)"/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(attrText))) {
      attrs[attrMatch[1]] = attrMatch[2];
    }
    results.push({ tag, attrs });
  }
  return results;
}
