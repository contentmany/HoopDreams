/* =========================================================
   FILE: src/lib/avatar.ts  (compose head-only avatar)
   - expects transparent PNG layers in /avatars
   - supports team-tinted headbands/beanies/durags (mask PNGs)
   ========================================================= */
import {loadImage} from './image';
import {makeRng} from './prng';
import {darken, pickContrast} from './color';

export type TeamColors = { primaryColor: string; secondaryColor?: string; };
export type AvatarParts = {
  tone: string;                   // e.g. "f2", "f3"
  eyes: { shape: string; color: string; };
  brows: string;                   // e.g. "soft_arc"
  mouth: string;                   // e.g. "neutral"
  beard?: string;                  // e.g. "goatee_dark" or "none"
  hair: string;                    // e.g. "taper_waves" or "bald"
  accessory?: string;              // "headband_colorable_narrow" | ...
  colors?: { accessory?: string }; // hex for tintable masks
};

const BASE = '/avatars';

// map a part name to its PNG URL (adjust if your structure differs)
export function partUrl(kind: string, name: string) {
  if (!name || name === 'none') return '';
  const folder = ({
    tone:'base', eyes:'eyes', brows:'brows', mouth:'mouth',
    beard:'beards', hair:'hair', accessory:'accessories', masks:'masks'
  } as any)[kind] || kind;
  return `${BASE}/${folder}/${name}.png`;
}

// Tint a white mask with a hex color and return an offscreen canvas
export async function tintMask(maskUrl: string, hex: string, size=512) {
  const img = await loadImage(maskUrl);
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = hex;
  ctx.fillRect(0,0,size,size);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(img, 0, 0, size, size);
  ctx.globalCompositeOperation = 'source-over';
  return c;
}

function isTintableAccessory(a?: string) {
  return !!a && (a.startsWith('headband_colorable') || a.startsWith('beanie_colorable') || a.startsWith('durag_colorable'));
}

// Compose layers into a <canvas> and return it
export async function composeAvatar(parts: AvatarParts, teamColor?: string, size=192) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d')!;
  const draw = async (url: string) => { if (!url) return; const img = await loadImage(url); ctx.drawImage(img, 0, 0, size, size); };

  // 1) base head (by tone)
  await draw(partUrl('tone', `head_base_${parts.tone}_neutral`));

  // 2) features
  await draw(partUrl('eyes', `eyes_${parts.eyes.shape}_${parts.eyes.color}`));
  await draw(partUrl('brows', `brows_${parts.brows}`));
  await draw(partUrl('mouth', `mouth_${parts.mouth}`));
  if (parts.beard && parts.beard !== 'none') await draw(partUrl('beard', `beard_${parts.beard}`));

  // 3) hair (skip if covered by colorable beanie/durag)
  const accessoryCoversHair = !!parts.accessory && (parts.accessory.includes('beanie_colorable') || parts.accessory.includes('durag_colorable'));
  if (!accessoryCoversHair && parts.hair && parts.hair !== 'bald') {
    await draw(partUrl('hair', `hair_${parts.hair}`));
  }

  // 4) accessory
  if (isTintableAccessory(parts.accessory)) {
    // default color from team if not supplied
    const want = parts.colors?.accessory
      || teamColor
      || '#ED6A22';
    const maskName =
      parts.accessory!.includes('durag') ? 'durag_mask' :
      parts.accessory!.includes('beanie') ? 'beanie_mask' :
      parts.accessory!.includes('wide') ? 'headband_wide_mask' : 'headband_mask';

    // special shading for beanie/durag
    const tint = parts.accessory!.includes('beanie') || parts.accessory!.includes('durag')
      ? darken(want, 18)
      : want;

    const maskCanvas = await tintMask(partUrl('masks', maskName), tint, size);
    ctx.drawImage(maskCanvas, 0, 0);

    // optional thin contrast line for headbands
    if (parts.accessory!.includes('headband')) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = pickContrast(tint);
      ctx.lineWidth = Math.max(1, Math.round(size/192)); // scale
      // simple line hint (center band)
      ctx.beginPath();
      ctx.moveTo(size*0.18, size*0.29);
      ctx.lineTo(size*0.82, size*0.29);
      ctx.stroke();
    }
  } else if (parts.accessory && parts.accessory !== 'none') {
    await draw(partUrl('accessory', parts.accessory));
  }

  return c.toDataURL('image/png');
}

// Convenience: returns an <img> element you can drop into UI
export async function renderAvatar(parts: AvatarParts, px=64, teamColor?: string) {
  const dataUrl = await composeAvatar(parts, teamColor, px);
  const img = new Image();
  img.width = px; img.height = px;
  img.decoding = 'async';
  img.src = dataUrl;
  img.alt = 'avatar';
  img.style.display = 'block';
  return img;
}

// Randomizer with stable seed + team-color accessories
export function randomAvatar(seed='npc-1', teamColor?: string): Promise<{ parts: AvatarParts; dataUrl: string }> {
  const rnd = makeRng(seed);
  const pick = <T>(arr:T[], w?:number[])=>{
    if (!w) return arr[Math.floor(rnd()*arr.length)];
    const sum = w.reduce((a,b)=>a+b,0);
    let t=rnd()*sum;
    for (let i=0;i<arr.length;i++){ t-=w[i]; if (t<=0) return arr[i]; }
    return arr[arr.length-1];
  };

  const tones = ['f1','f2','f3','f4','f5'];
  const eyes  = ['almond','round','wide'];
  const brows = ['soft_arc','straight','thick'];
  const mouths= ['neutral','soft_smile','smirk'];
  const beards= ['none','stubble','goatee_dark','full_beard_short'];
  const hairs  = [
    'bald','low_cut','caesar','taper_waves','short_waves_deep','taper_curl',
    'twists_medium','twists_long','locs_high_bun','locs_taper','afro_medium_round','afro_high_round',
    'cornrows_straight','cornrows_curve','fade_low','fade_mid','fade_high','drop_fade','burst_fade'
  ];
  const accessories = ['none','headband_colorable_narrow','headband_colorable_wide','beanie_colorable','durag_colorable'];

  let accessory = pick(accessories, [65,15,10,5,5]);
  let hair = pick(hairs);
  if (accessory.includes('beanie') || accessory.includes('durag')) hair = 'bald';
  if (accessory.includes('headband') && ['locs_high_bun','top_knot'].includes(hair)) {
    hair = 'low_cut';
  }

  const accessorHex = teamColor;

  const parts: AvatarParts = {
    tone: pick(tones),
    eyes: { shape: pick(eyes), color: 'dark_brown' },
    brows: pick(brows),
    mouth: pick(mouths),
    beard: pick(beards, [60,15,15,10]),
    hair,
    accessory,
    colors: accessorHex ? { accessory: accessorHex } : {}
  };

  return composeAvatar(parts, teamColor).then(dataUrl => ({ parts, dataUrl }));
}

// Legacy support - load assets function (no-op since we don't pre-load)
export async function loadAvatarAssets() {
  return Promise.resolve();
}