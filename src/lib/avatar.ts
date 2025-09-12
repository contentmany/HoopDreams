import { hexToRgb } from './color';

export interface AvatarParts {
  tone: string;
  expr: string;
  eyes: {
    shape: string;
    color: string;
  };
  brows: string;
  mouth: string;
  beard?: string;
  hair: string;
  accessory?: string;
}

interface AvatarManifest {
  skinTones: [string, string][];
  eyes: {
    shapes: string[];
    colors: string[];
  };
  brows: string[];
  mouths: string[];
  hair: string[];
  beard: string[];
  accessories: string[];
}

let manifest: AvatarManifest | null = null;
const imageCache = new Map<string, HTMLImageElement>();

// Mulberry32 seedable PRNG
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export async function loadAvatarAssets(): Promise<void> {
  if (manifest) return;
  
  try {
    const response = await fetch('/avatars/manifest.json');
    manifest = await response.json();
  } catch (error) {
    console.error('Failed to load avatar manifest:', error);
    throw error;
  }
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

export async function tintMask(maskUrl: string, hex: string, size = 512): Promise<HTMLCanvasElement> {
  const img = await loadImage(maskUrl);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  // Draw the solid color
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, size, size);
  
  // Keep only where mask is opaque
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(img, 0, 0, size, size);
  ctx.globalCompositeOperation = 'source-over';
  
  return canvas;
}

export async function composeAvatar(parts: AvatarParts, teamColor?: string, size = 512): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  // Layer order: base → eyes → brows → mouth → beard → hair → accessory
  const layers: Array<{ url: string; tint?: string }> = [];
  
  // Base head
  layers.push({ url: `/avatars/base/head_base_${parts.tone}_${parts.expr}.svg` });
  
  // Eyes
  layers.push({ url: `/avatars/eyes/eyes_${parts.eyes.shape}_${parts.eyes.color}.svg` });
  
  // Brows
  layers.push({ url: `/avatars/brows/brows_${parts.brows}.svg` });
  
  // Mouth
  layers.push({ url: `/avatars/mouth/mouth_${parts.mouth}.svg` });
  
  // Beard
  if (parts.beard && parts.beard !== 'none') {
    layers.push({ url: `/avatars/beard/beard_${parts.beard}.svg` });
  }
  
  // Hair
  if (parts.hair !== 'bald') {
    layers.push({ url: `/avatars/hair/hair_${parts.hair}.svg` });
  }
  
  // Accessories
  if (parts.accessory && parts.accessory !== 'none') {
    if (parts.accessory.includes('colorable')) {
      // Handle team-color tinting
      const tintColor = teamColor || '#7A5BFF'; // Use passed teamColor or default
      layers.push({ url: `/avatars/masks/${parts.accessory.replace('_colorable', '_mask')}.svg`, tint: tintColor });
    } else {
      layers.push({ url: `/avatars/accessory/accessory_${parts.accessory}.svg` });
    }
  }
  
  // Draw all layers
  for (const layer of layers) {
    try {
      if (layer.tint) {
        // Tint the mask
        const tintedCanvas = await tintMask(layer.url, layer.tint, size);
        ctx.drawImage(tintedCanvas, 0, 0, size, size);
      } else {
        // Regular image
        const img = await loadImage(layer.url);
        ctx.drawImage(img, 0, 0, size, size);
      }
    } catch (error) {
      console.warn(`Failed to load layer: ${layer.url}`, error);
      // Continue with other layers
    }
  }
  
  return canvas.toDataURL('image/png');
}

export async function randomAvatar(seed?: string, teamColor?: string): Promise<{ parts: AvatarParts; dataUrl: string }> {
  await loadAvatarAssets();
  if (!manifest) throw new Error('Manifest not loaded');
  
  const seedNum = seed ? hashString(seed) : Math.floor(Math.random() * 1000000);
  const rng = mulberry32(seedNum);
  
  // Pick skin tone with even weights
  const toneIndex = Math.floor(rng() * manifest.skinTones.length);
  const tone = manifest.skinTones[toneIndex][0];
  
  // Expression (mostly neutral)
  const expr = rng() < 0.8 ? 'neutral' : 'soft_smile';
  
  // Eyes
  const eyeShape = manifest.eyes.shapes[Math.floor(rng() * manifest.eyes.shapes.length)];
  const eyeColor = manifest.eyes.colors[Math.floor(rng() * manifest.eyes.colors.length)];
  
  // Other features
  const brows = manifest.brows[Math.floor(rng() * manifest.brows.length)];
  const mouth = manifest.mouths[Math.floor(rng() * manifest.mouths.length)];
  
  // Hair (bald is rare - 5%)
  let hair: string;
  if (rng() < 0.05) {
    hair = 'bald';
  } else {
    const nonBaldHair = manifest.hair.filter(h => h !== 'bald');
    hair = nonBaldHair[Math.floor(rng() * nonBaldHair.length)];
  }
  
  // Beard (30% chance)
  const beard = rng() < 0.3 ? 
    manifest.beard[Math.floor(rng() * manifest.beard.length)] : 'none';
  
  // Accessories with rules
  let accessory = 'none';
  if (rng() < 0.2) { // 20% chance of accessory
    const availableAccessories = manifest.accessories.filter(acc => {
      if (acc === 'none') return false;
      
      // If hair is headgear, no additional accessories
      if (['beanie_black', 'durag_black'].includes(hair)) return false;
      
      // Headband accessories work with certain hairstyles
      if (acc.includes('headband') || acc.includes('colorable')) {
        const compatibleHair = ['box_braids', 'cornrows_back', 'cornrows_straight', 
                               'long_locs', 'curls_tight', 'curls_loose', 'waves', 'low_cut'];
        return compatibleHair.includes(hair);
      }
      
      return true;
    });
    
    if (availableAccessories.length > 0) {
      accessory = availableAccessories[Math.floor(rng() * availableAccessories.length)];
    }
  }
  
  const parts: AvatarParts = {
    tone,
    expr,
    eyes: { shape: eyeShape, color: eyeColor },
    brows,
    mouth,
    beard,
    hair,
    accessory
  };
  
  const dataUrl = await composeAvatar(parts, teamColor);
  
  return { parts, dataUrl };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}