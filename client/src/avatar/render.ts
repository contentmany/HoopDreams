import type { AvatarDNA, EyeShape, BrowStyle, HairStyle, FacialHair, HeadGear, Accent } from './types';
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
  const headRadius = size * 0.35;
  
  // Clear canvas (transparent background)
  ctx.clearRect(0, 0, size, size);
  
  // Draw head shape (rounded oval)
  ctx.save();
  const skinColor = skinHex[dna.skin];
  ctx.fillStyle = skinColor;
  ctx.beginPath();
  ctx.ellipse(center, center * 0.95, headRadius, headRadius * 1.1, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Add subtle head shadow/dimension
  const gradient = ctx.createRadialGradient(center - headRadius * 0.3, center - headRadius * 0.2, 0, center, center, headRadius);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
  
  // Draw ears
  drawEars(ctx, center, headRadius, skinColor);
  
  // Draw hair (before facial features for proper layering)
  drawHair(ctx, center, headRadius, dna.hairStyle, dna.hairColor, size);
  
  // Draw eyes
  drawEyes(ctx, center, headRadius, dna.eyeShape, dna.eyeColor);
  
  // Draw brows
  drawBrows(ctx, center, headRadius, dna.brow, dna.hairColor);
  
  // Draw nose
  drawNose(ctx, center, headRadius, skinColor);
  
  // Draw mouth
  drawMouth(ctx, center, headRadius);
  
  // Draw facial hair
  if (dna.facialHair !== 'none') {
    drawFacialHair(ctx, center, headRadius, dna.facialHair, dna.hairColor);
  }
  
  // Draw head gear
  if (dna.headGear !== 'none' && dna.headGearColor) {
    drawHeadGear(ctx, center, headRadius, dna.headGear, dna.headGearColor, size);
  }
  
  // Draw accents (earrings)
  if (dna.accent !== 'none') {
    drawAccents(ctx, center, headRadius, dna.accent);
  }
  
  // Draw jersey collar hint at bottom
  drawJerseyHint(ctx, center, size, dna.jerseyColor);
}

function drawEars(ctx: CanvasRenderingContext2D, center: number, headRadius: number, skinColor: string): void {
  const earSize = headRadius * 0.15;
  const earY = center * 0.95;
  
  ctx.fillStyle = skinColor;
  
  // Left ear
  ctx.beginPath();
  ctx.ellipse(center - headRadius * 0.9, earY, earSize, earSize * 1.2, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Right ear
  ctx.beginPath();
  ctx.ellipse(center + headRadius * 0.9, earY, earSize, earSize * 1.2, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Ear inner shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.beginPath();
  ctx.ellipse(center - headRadius * 0.9, earY, earSize * 0.4, earSize * 0.6, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(center + headRadius * 0.9, earY, earSize * 0.4, earSize * 0.6, 0, 0, 2 * Math.PI);
  ctx.fill();
}

function drawEyes(ctx: CanvasRenderingContext2D, center: number, headRadius: number, shape: EyeShape, color: string): void {
  const eyeY = center * 0.85;
  const eyeWidth = headRadius * 0.25;
  const eyeHeight = headRadius * 0.15;
  const eyeSpacing = headRadius * 0.6;
  
  const eyeColor = eyeHex[color];
  
  // Left eye
  drawSingleEye(ctx, center - eyeSpacing, eyeY, eyeWidth, eyeHeight, shape, eyeColor);
  
  // Right eye  
  drawSingleEye(ctx, center + eyeSpacing, eyeY, eyeWidth, eyeHeight, shape, eyeColor);
}

function drawSingleEye(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, shape: EyeShape, color: string): void {
  ctx.save();
  
  // Eye white
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  
  switch (shape) {
    case 'round':
      ctx.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
      break;
    case 'almond':
      ctx.ellipse(x, y, width * 1.1, height * 0.8, 0, 0, 2 * Math.PI);
      break;
    case 'narrow':
      ctx.ellipse(x, y, width * 1.2, height * 0.6, 0, 0, 2 * Math.PI);
      break;
  }
  ctx.fill();
  
  // Iris
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, width * 0.6, height * 0.8, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Pupil
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(x, y, width * 0.3, height * 0.4, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Highlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x - width * 0.1, y - height * 0.2, width * 0.15, height * 0.2, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.restore();
}

function drawBrows(ctx: CanvasRenderingContext2D, center: number, headRadius: number, style: BrowStyle, hairColor: string): void {
  const browY = center * 0.75;
  const browWidth = headRadius * 0.3;
  const browHeight = headRadius * 0.08;
  const browSpacing = headRadius * 0.6;
  
  const browColor = darkenColor(hairColor, 0.1);
  ctx.fillStyle = browColor;
  ctx.strokeStyle = browColor;
  ctx.lineWidth = browHeight;
  ctx.lineCap = 'round';
  
  switch (style) {
    case 'straight':
      // Left brow
      ctx.beginPath();
      ctx.moveTo(center - browSpacing - browWidth/2, browY);
      ctx.lineTo(center - browSpacing + browWidth/2, browY);
      ctx.stroke();
      
      // Right brow
      ctx.beginPath();
      ctx.moveTo(center + browSpacing - browWidth/2, browY);
      ctx.lineTo(center + browSpacing + browWidth/2, browY);
      ctx.stroke();
      break;
      
    case 'soft':
      // Left brow (slightly curved)
      ctx.beginPath();
      ctx.moveTo(center - browSpacing - browWidth/2, browY + browHeight/4);
      ctx.quadraticCurveTo(center - browSpacing, browY - browHeight/4, center - browSpacing + browWidth/2, browY + browHeight/4);
      ctx.stroke();
      
      // Right brow
      ctx.beginPath();
      ctx.moveTo(center + browSpacing - browWidth/2, browY + browHeight/4);
      ctx.quadraticCurveTo(center + browSpacing, browY - browHeight/4, center + browSpacing + browWidth/2, browY + browHeight/4);
      ctx.stroke();
      break;
      
    case 'arched':
      // Left brow (more arched)
      ctx.beginPath();
      ctx.moveTo(center - browSpacing - browWidth/2, browY + browHeight/2);
      ctx.quadraticCurveTo(center - browSpacing, browY - browHeight/2, center - browSpacing + browWidth/2, browY + browHeight/2);
      ctx.stroke();
      
      // Right brow
      ctx.beginPath();
      ctx.moveTo(center + browSpacing - browWidth/2, browY + browHeight/2);
      ctx.quadraticCurveTo(center + browSpacing, browY - browHeight/2, center + browSpacing + browWidth/2, browY + browHeight/2);
      ctx.stroke();
      break;
  }
}

function drawNose(ctx: CanvasRenderingContext2D, center: number, headRadius: number, skinColor: string): void {
  const noseY = center * 1.0;
  const noseWidth = headRadius * 0.12;
  const noseHeight = headRadius * 0.15;
  
  // Simple nose shadow/definition
  const gradient = ctx.createLinearGradient(center - noseWidth, noseY, center + noseWidth, noseY);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(center, noseY, noseWidth, noseHeight, 0, 0, 2 * Math.PI);
  ctx.fill();
}

function drawMouth(ctx: CanvasRenderingContext2D, center: number, headRadius: number): void {
  const mouthY = center * 1.2;
  const mouthWidth = headRadius * 0.2;
  
  ctx.strokeStyle = '#b87b7b';
  ctx.lineWidth = headRadius * 0.02;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(center - mouthWidth/2, mouthY);
  ctx.quadraticCurveTo(center, mouthY + headRadius * 0.05, center + mouthWidth/2, mouthY);
  ctx.stroke();
}

function drawHair(ctx: CanvasRenderingContext2D, center: number, headRadius: number, style: HairStyle, color: string, size: number): void {
  if (style === 'bald') return;
  
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  
  switch (style) {
    case 'short':
      // Simple short hair cap
      ctx.beginPath();
      ctx.ellipse(center, center * 0.7, headRadius * 0.95, headRadius * 0.6, 0, 0, Math.PI, true);
      ctx.fill();
      break;
      
    case 'fade':
      // Faded sides, longer on top
      ctx.beginPath();
      ctx.ellipse(center, center * 0.65, headRadius * 0.9, headRadius * 0.5, 0, 0, Math.PI, true);
      ctx.fill();
      break;
      
    case 'waves':
      // Wavy texture on top
      ctx.beginPath();
      ctx.ellipse(center, center * 0.7, headRadius * 0.95, headRadius * 0.65, 0, 0, Math.PI, true);
      ctx.fill();
      
      // Add wave texture
      ctx.strokeStyle = darkenColor(color, 0.2);
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const waveY = center * 0.6 + i * (headRadius * 0.1);
        ctx.beginPath();
        ctx.moveTo(center - headRadius * 0.7, waveY);
        ctx.quadraticCurveTo(center - headRadius * 0.3, waveY + 2, center, waveY);
        ctx.quadraticCurveTo(center + headRadius * 0.3, waveY - 2, center + headRadius * 0.7, waveY);
        ctx.stroke();
      }
      break;
      
    case 'afroLow':
      // Small afro
      ctx.beginPath();
      ctx.ellipse(center, center * 0.75, headRadius * 1.1, headRadius * 0.8, 0, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'afroHigh':
      // Large afro
      ctx.beginPath();
      ctx.ellipse(center, center * 0.7, headRadius * 1.3, headRadius * 1.0, 0, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'braids':
      // Braided pattern
      ctx.beginPath();
      ctx.ellipse(center, center * 0.7, headRadius * 0.95, headRadius * 0.7, 0, 0, Math.PI, true);
      ctx.fill();
      
      // Add braid lines
      ctx.strokeStyle = darkenColor(color, 0.3);
      ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(center + i * (headRadius * 0.25), center * 0.5);
        ctx.lineTo(center + i * (headRadius * 0.25), center * 0.9);
        ctx.stroke();
      }
      break;
      
    case 'twists':
      // Twisted hair
      ctx.beginPath();
      ctx.ellipse(center, center * 0.7, headRadius * 0.95, headRadius * 0.7, 0, 0, Math.PI, true);
      ctx.fill();
      break;
      
    case 'locs':
      // Dreadlocks
      ctx.beginPath();
      ctx.ellipse(center, center * 0.7, headRadius * 1.0, headRadius * 0.8, 0, 0, Math.PI, true);
      ctx.fill();
      
      // Add loc strands
      ctx.strokeStyle = darkenColor(color, 0.2);
      ctx.lineWidth = 3;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(center + i * (headRadius * 0.2), center * 0.55);
        ctx.lineTo(center + i * (headRadius * 0.2), center * 1.1);
        ctx.stroke();
      }
      break;
      
    case 'buzz':
      // Very short buzz cut
      ctx.beginPath();
      ctx.ellipse(center, center * 0.75, headRadius * 0.9, headRadius * 0.5, 0, 0, Math.PI, true);
      ctx.fill();
      break;
  }
}

function drawFacialHair(ctx: CanvasRenderingContext2D, center: number, headRadius: number, style: FacialHair, color: string): void {
  ctx.fillStyle = color;
  
  switch (style) {
    case 'goatee':
      ctx.beginPath();
      ctx.ellipse(center, center * 1.3, headRadius * 0.15, headRadius * 0.2, 0, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'mustache':
      ctx.strokeStyle = color;
      ctx.lineWidth = headRadius * 0.08;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(center - headRadius * 0.2, center * 1.1);
      ctx.lineTo(center + headRadius * 0.2, center * 1.1);
      ctx.stroke();
      break;
      
    case 'beardShort':
      ctx.beginPath();
      ctx.ellipse(center, center * 1.25, headRadius * 0.4, headRadius * 0.25, 0, 0, Math.PI);
      ctx.fill();
      break;
      
    case 'beardFull':
      ctx.beginPath();
      ctx.ellipse(center, center * 1.3, headRadius * 0.6, headRadius * 0.4, 0, 0, Math.PI);
      ctx.fill();
      break;
  }
}

function drawHeadGear(ctx: CanvasRenderingContext2D, center: number, headRadius: number, gear: HeadGear, color: string, size: number): void {
  ctx.fillStyle = color;
  
  switch (gear) {
    case 'headband':
      // Thin band around forehead area
      ctx.strokeStyle = color;
      ctx.lineWidth = headRadius * 0.12;
      ctx.beginPath();
      ctx.ellipse(center, center * 0.8, headRadius * 0.95, headRadius * 0.95, 0, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
      break;
      
    case 'durag':
      // Smooth cap with tail
      ctx.beginPath();
      ctx.ellipse(center, center * 0.75, headRadius * 1.0, headRadius * 0.7, 0, 0, Math.PI, true);
      ctx.fill();
      
      // Durag tail/ties at back
      ctx.beginPath();
      ctx.ellipse(center + headRadius * 0.8, center * 0.9, headRadius * 0.15, headRadius * 0.05, Math.PI/4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(center - headRadius * 0.8, center * 0.9, headRadius * 0.15, headRadius * 0.05, -Math.PI/4, 0, 2 * Math.PI);
      ctx.fill();
      break;
      
    case 'beanie':
      // Knit cap
      ctx.beginPath();
      ctx.ellipse(center, center * 0.65, headRadius * 1.0, headRadius * 0.8, 0, 0, Math.PI, true);
      ctx.fill();
      
      // Add fold/rim
      ctx.strokeStyle = darkenColor(color, 0.2);
      ctx.lineWidth = headRadius * 0.08;
      ctx.beginPath();
      ctx.ellipse(center, center * 0.85, headRadius * 0.95, headRadius * 0.95, 0, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
      break;
  }
}

function drawAccents(ctx: CanvasRenderingContext2D, center: number, headRadius: number, accent: Accent): void {
  const earringSize = headRadius * 0.05;
  const earY = center * 0.95;
  
  ctx.fillStyle = '#ffd700'; // Gold color for earrings
  
  if (accent === 'earringL' || accent === 'earringBoth') {
    // Left earring
    ctx.beginPath();
    ctx.ellipse(center - headRadius * 0.95, earY + headRadius * 0.15, earringSize, earringSize, 0, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  if (accent === 'earringR' || accent === 'earringBoth') {
    // Right earring
    ctx.beginPath();
    ctx.ellipse(center + headRadius * 0.95, earY + headRadius * 0.15, earringSize, earringSize, 0, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawJerseyHint(ctx: CanvasRenderingContext2D, center: number, size: number, color: string): void {
  // Draw tiny V-neck collar at bottom of avatar
  const collarY = size * 0.9;
  const collarWidth = size * 0.3;
  
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(center - collarWidth/2, collarY);
  ctx.lineTo(center, collarY + size * 0.08);
  ctx.lineTo(center + collarWidth/2, collarY);
  ctx.lineTo(center + collarWidth/2, size);
  ctx.lineTo(center - collarWidth/2, size);
  ctx.closePath();
  ctx.fill();
}