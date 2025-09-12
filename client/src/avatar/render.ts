import type { AvatarDNA, EyeShape, BrowStyle, HairStyle, FacialHair, HeadGear, Accent, EyeColor } from './types';
import { skinHex, eyeHex, darkenColor } from './colors';

export function renderHeadPNG(dna: AvatarDNA, size: number = 96): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Enable image smoothing for clean edges
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  drawHead(ctx, size, dna);
  
  return canvas.toDataURL('image/png');
}

export function drawHead(ctx: CanvasRenderingContext2D, size: number, dna: AvatarDNA): void {
  const center = size / 2;
  const headWidth = size * 0.32;
  const headHeight = size * 0.4;
  
  // Clear canvas (transparent background)
  ctx.clearRect(0, 0, size, size);
  
  // Draw head shape (clean oval, flat style)
  ctx.save();
  const skinColor = skinHex[dna.skin];
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.ellipse(center, center * 0.9, headWidth, headHeight, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
  
  // Draw ears (simple flat ovals)
  drawEars(ctx, center, headWidth, headHeight, skinColor);
  
  // Draw hair (before facial features for proper layering)
  if (dna.hairStyle !== 'bald') {
    drawHair(ctx, center, headWidth, headHeight, dna.hairStyle, dna.hairColor, size);
  }
  
  // Draw eyes
  drawEyes(ctx, center, headWidth, headHeight, dna.eyeShape, dna.eyeColor, size);
  
  // Draw brows  
  drawBrows(ctx, center, headWidth, headHeight, dna.brow, dna.hairColor, size);
  
  // Draw nose (subtle, like references)
  drawNose(ctx, center, headWidth, headHeight, skinColor, size);
  
  // Draw mouth
  drawMouth(ctx, center, headWidth, headHeight, size);
  
  // Draw facial hair
  if (dna.facialHair !== 'none') {
    drawFacialHair(ctx, center, headWidth, headHeight, dna.facialHair, dna.hairColor, size);
  }
  
  // Draw head gear
  if (dna.headGear !== 'none' && dna.headGearColor) {
    drawHeadGear(ctx, center, headWidth, headHeight, dna.headGear, dna.headGearColor, size);
  }
  
  // Draw accents (earrings)
  if (dna.accent !== 'none') {
    drawAccents(ctx, center, headWidth, headHeight, dna.accent, size);
  }
  
  // Draw jersey collar hint
  drawJerseyCollar(ctx, center, headWidth, headHeight, dna.jerseyColor, size);
}

function drawEars(ctx: CanvasRenderingContext2D, centerX: number, headWidth: number, headHeight: number, skinColor: string): void {
  const earWidth = headWidth * 0.15;
  const earHeight = headHeight * 0.2;
  const earY = centerX * 0.9;
  
  ctx.fillStyle = skinColor;
  
  // Left ear
  ctx.beginPath();
  ctx.ellipse(centerX - headWidth - earWidth/2, earY, earWidth, earHeight, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Right ear  
  ctx.beginPath();
  ctx.ellipse(centerX + headWidth + earWidth/2, earY, earWidth, earHeight, 0, 0, 2 * Math.PI);
  ctx.fill();
}

function drawHair(ctx: CanvasRenderingContext2D, centerX: number, headWidth: number, headHeight: number, hairStyle: HairStyle, hairColor: string, size: number): void {
  ctx.fillStyle = hairColor;
  ctx.strokeStyle = darkenColor(hairColor, 0.2);
  ctx.lineWidth = size * 0.01;
  
  const hairTop = centerX * 0.9 - headHeight;
  const hairBottom = centerX * 0.9 - headHeight * 0.3;
  
  ctx.beginPath();
  
  switch (hairStyle) {
    case 'short':
      // Clean short hair around head
      ctx.ellipse(centerX, hairTop + headHeight * 0.1, headWidth * 1.1, headHeight * 0.4, 0, 0, Math.PI, true);
      break;
      
    case 'fade':
      // Short sides, longer top
      ctx.ellipse(centerX, hairTop + headHeight * 0.15, headWidth * 1.05, headHeight * 0.35, 0, 0, Math.PI, true);
      break;
      
    case 'waves':
      // Wavy texture on top
      ctx.ellipse(centerX, hairTop + headHeight * 0.1, headWidth * 1.1, headHeight * 0.4, 0, 0, Math.PI, true);
      ctx.fill();
      // Add wave lines
      ctx.beginPath();
      ctx.strokeStyle = darkenColor(hairColor, 0.3);
      for (let i = -2; i <= 2; i++) {
        const y = hairTop + headHeight * 0.2;
        ctx.moveTo(centerX - headWidth * 0.8 + i * headWidth * 0.4, y);
        ctx.quadraticCurveTo(centerX - headWidth * 0.4 + i * headWidth * 0.4, y - headHeight * 0.1, centerX + i * headWidth * 0.4, y);
      }
      ctx.stroke();
      return;
      
    case 'afroLow':
      // Small afro
      ctx.ellipse(centerX, hairTop + headHeight * 0.05, headWidth * 1.2, headHeight * 0.45, 0, 0, Math.PI, true);
      break;
      
    case 'afroHigh':  
      // Large afro
      ctx.ellipse(centerX, hairTop - headHeight * 0.1, headWidth * 1.4, headHeight * 0.6, 0, 0, Math.PI, true);
      break;
      
    case 'braids':
      // Braided hair
      ctx.ellipse(centerX, hairTop + headHeight * 0.1, headWidth * 1.1, headHeight * 0.4, 0, 0, Math.PI, true);
      ctx.fill();
      // Add braid lines
      ctx.beginPath();
      ctx.strokeStyle = darkenColor(hairColor, 0.3);
      for (let i = -3; i <= 3; i++) {
        const x = centerX + i * headWidth * 0.2;
        ctx.moveTo(x, hairTop + headHeight * 0.1);
        ctx.lineTo(x, hairBottom);
      }
      ctx.stroke();
      return;
      
    case 'twists':
      // Twisted hair
      ctx.ellipse(centerX, hairTop + headHeight * 0.1, headWidth * 1.1, headHeight * 0.4, 0, 0, Math.PI, true);
      break;
      
    case 'locs':
      // Dreadlocks
      ctx.ellipse(centerX, hairTop + headHeight * 0.1, headWidth * 1.15, headHeight * 0.4, 0, 0, Math.PI, true);
      break;
      
    case 'buzz':
      // Very short buzz cut
      ctx.ellipse(centerX, hairTop + headHeight * 0.2, headWidth * 1.05, headHeight * 0.3, 0, 0, Math.PI, true);
      break;
  }
  
  ctx.fill();
  if (ctx.lineWidth > 0) {
    ctx.stroke();
  }
}

function drawEyes(ctx: CanvasRenderingContext2D, centerX: number, headWidth: number, headHeight: number, eyeShape: EyeShape, eyeColor: EyeColor, size: number): void {
  const eyeY = centerX * 0.85;
  const eyeWidth = size * 0.08;
  const eyeHeight = size * 0.08;
  const eyeSpacing = headWidth * 0.5;
  
  const pupilColor = eyeHex[eyeColor];
  
  // Left eye
  drawSingleEye(ctx, centerX - eyeSpacing, eyeY, eyeWidth, eyeHeight, eyeShape, pupilColor);
  
  // Right eye
  drawSingleEye(ctx, centerX + eyeSpacing, eyeY, eyeWidth, eyeHeight, eyeShape, pupilColor);
}

function drawSingleEye(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, shape: EyeShape, pupilColor: string): void {
  // White of eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  
  switch (shape) {
    case 'round':
      ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
      break;
    case 'almond':
      // Almond shape - ellipse with points
      ctx.ellipse(x, y, width * 1.1, height * 0.8, 0, 0, 2 * Math.PI);
      break;
    case 'narrow':
      ctx.ellipse(x, y, width * 1.2, height * 0.7, 0, 0, 2 * Math.PI);
      break;
  }
  
  ctx.fill();
  
  // Pupil
  ctx.fillStyle = pupilColor;
  ctx.beginPath();
  ctx.ellipse(x, y, width * 0.6, height * 0.6, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // White highlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x - width * 0.2, y - height * 0.2, width * 0.25, height * 0.25, 0, 0, 2 * Math.PI);
  ctx.fill();
}

function drawBrows(ctx: CanvasRenderingContext2D, centerX: number, headWidth: number, headHeight: number, browStyle: BrowStyle, hairColor: string, size: number): void {
  const browY = centerX * 0.75;
  const browWidth = size * 0.07;
  const browHeight = size * 0.02;
  const browSpacing = headWidth * 0.5;
  
  ctx.fillStyle = darkenColor(hairColor, 0.3);
  ctx.strokeStyle = darkenColor(hairColor, 0.3);
  ctx.lineWidth = size * 0.01;
  
  // Left brow
  drawSingleBrow(ctx, centerX - browSpacing, browY, browWidth, browHeight, browStyle, false);
  
  // Right brow  
  drawSingleBrow(ctx, centerX + browSpacing, browY, browWidth, browHeight, browStyle, true);
}

function drawSingleBrow(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, style: BrowStyle, isRight: boolean): void {
  ctx.beginPath();
  
  const direction = isRight ? 1 : -1;
  
  switch (style) {
    case 'straight':
      ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
      break;
    case 'soft':
      ctx.ellipse(x, y, width, height * 1.2, direction * 0.1, 0, 2 * Math.PI);
      break;
    case 'arched':
      ctx.ellipse(x, y, width, height * 1.1, direction * 0.2, 0, 2 * Math.PI);
      break;
  }
  
  ctx.fill();
}

function drawNose(ctx: CanvasRenderingContext2D, centerX: number, headWidth: number, headHeight: number, skinColor: string, size: number): void {
  const noseY = centerX * 0.95;
  const noseWidth = size * 0.02;
  const noseHeight = size * 0.03;
  
  // Subtle nose shadow
  ctx.fillStyle = darkenColor(skinColor, 0.1);
  ctx.beginPath();
  ctx.ellipse(centerX, noseY, noseWidth, noseHeight, 0, 0, 2 * Math.PI);
  ctx.fill();
}

function drawMouth(ctx: CanvasRenderingContext2D, centerX: number, headWidth: number, headHeight: number, size: number): void {
  const mouthY = centerX * 1.05;
  const mouthWidth = size * 0.04;
  const mouthHeight = size * 0.01;
  
  // Simple mouth line
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(centerX, mouthY, mouthWidth, mouthHeight, 0, 0, 2 * Math.PI);
  ctx.fill();
}

function drawFacialHair(ctx: CanvasRenderingContext2D, centerX: number, headWidth: number, headHeight: number, facialHair: FacialHair, hairColor: string, size: number): void {
  ctx.fillStyle = darkenColor(hairColor, 0.2);
  
  const chinY = centerX * 0.9 + headHeight;
  const mouthY = centerX * 1.05;
  
  ctx.beginPath();
  
  switch (facialHair) {
    case 'goatee':
      // Small goatee under chin
      ctx.ellipse(centerX, chinY - headHeight * 0.1, headWidth * 0.2, headHeight * 0.15, 0, 0, 2 * Math.PI);
      break;
      
    case 'mustache':
      // Mustache above mouth
      ctx.ellipse(centerX, mouthY - headHeight * 0.05, headWidth * 0.25, headHeight * 0.05, 0, 0, 2 * Math.PI);
      break;
      
    case 'beardShort':
      // Short beard along jawline
      ctx.ellipse(centerX, chinY - headHeight * 0.05, headWidth * 0.8, headHeight * 0.2, 0, 0, Math.PI);
      break;
      
    case 'beardFull':
      // Full beard
      ctx.ellipse(centerX, chinY, headWidth * 0.9, headHeight * 0.25, 0, 0, Math.PI);
      break;
  }
  
  ctx.fill();
}

function drawHeadGear(ctx: CanvasRenderingContext2D, centerX: number, headWidth: number, headHeight: number, headGear: HeadGear, headGearColor: string, size: number): void {
  ctx.fillStyle = headGearColor;
  
  const headTop = centerX * 0.9 - headHeight;
  
  switch (headGear) {
    case 'headband':
      // Thin headband around forehead
      ctx.beginPath();
      ctx.ellipse(centerX, headTop + headHeight * 0.25, headWidth * 1.1, headHeight * 0.08, 0, 0, Math.PI, true);
      ctx.fill();
      break;
      
    case 'durag':
      // Durag covering most of head
      ctx.beginPath();
      ctx.ellipse(centerX, headTop + headHeight * 0.1, headWidth * 1.15, headHeight * 0.5, 0, 0, Math.PI, true);
      ctx.fill();
      // Add durag ties
      ctx.fillStyle = darkenColor(headGearColor, 0.2);
      ctx.beginPath();
      ctx.ellipse(centerX - headWidth * 0.8, headTop + headHeight * 0.3, headWidth * 0.1, headHeight * 0.05, -0.3, 0, 2 * Math.PI);
      ctx.ellipse(centerX + headWidth * 0.8, headTop + headHeight * 0.3, headWidth * 0.1, headHeight * 0.05, 0.3, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'beanie':
      // Knit beanie
      ctx.beginPath();
      ctx.ellipse(centerX, headTop - headHeight * 0.05, headWidth * 1.2, headHeight * 0.6, 0, 0, Math.PI, true);
      ctx.fill();
      break;
  }
}

function drawAccents(ctx: CanvasRenderingContext2D, centerX: number, headWidth: number, headHeight: number, accent: Accent, size: number): void {
  const earringSize = size * 0.015;
  const earY = centerX * 0.9;
  const earX = headWidth + earringSize;
  
  ctx.fillStyle = '#FFD700'; // Gold color for earrings
  
  switch (accent) {
    case 'earringL':
      ctx.beginPath();
      ctx.ellipse(centerX - earX, earY + headHeight * 0.1, earringSize, earringSize, 0, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'earringR':
      ctx.beginPath();
      ctx.ellipse(centerX + earX, earY + headHeight * 0.1, earringSize, earringSize, 0, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'earringBoth':
      ctx.beginPath();
      ctx.ellipse(centerX - earX, earY + headHeight * 0.1, earringSize, earringSize, 0, 0, 2 * Math.PI);
      ctx.ellipse(centerX + earX, earY + headHeight * 0.1, earringSize, earringSize, 0, 0, 2 * Math.PI);
      ctx.fill();
      break;
  }
}

function drawJerseyCollar(ctx: CanvasRenderingContext2D, centerX: number, headWidth: number, headHeight: number, jerseyColor: string, size: number): void {
  const collarY = centerX * 0.9 + headHeight + headHeight * 0.1;
  const collarWidth = headWidth * 0.6;
  const collarHeight = size * 0.08;
  
  // Draw V-neck collar hint
  ctx.fillStyle = jerseyColor;
  ctx.beginPath();
  ctx.moveTo(centerX - collarWidth, collarY);
  ctx.lineTo(centerX, collarY + collarHeight);
  ctx.lineTo(centerX + collarWidth, collarY);
  ctx.lineTo(centerX + collarWidth * 0.8, collarY - collarHeight * 0.2);
  ctx.lineTo(centerX - collarWidth * 0.8, collarY - collarHeight * 0.2);
  ctx.closePath();
  ctx.fill();
}