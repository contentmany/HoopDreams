// V2 Avatar System - Canvas-based procedural head rendering
// Provides window.AvatarKit with render() and randomDNA() functions

// Define hair styles and colors
const HAIR_STYLES = [
  'bald', 'buzz', 'short', 'curly', 'afro', 'fade', 'braids'
];

const HAIR_COLORS = {
  black: { base: '#1b1b1b', shine: '#2a2a2a' },
  brown: { base: '#5a4331', shine: '#6b5341' },
  dark_brown: { base: '#3a2c22', shine: '#4a3a2d' },
  blond: { base: '#ad895f', shine: '#c59e74' },
  red: { base: '#8b3a1e', shine: '#a1472a' }
};

const SKIN_TONES = {
  light: { base: '#f1c9a5', shadow: '#d9a06b', highlight: '#ffd9ba' },
  tan: { base: '#d9a06b', shadow: '#b07844', highlight: '#f2be8d' },
  brown: { base: '#a8693a', shadow: '#824b26', highlight: '#c58555' },
  deep: { base: '#6b3b1f', shadow: '#4b2513', highlight: '#865237' }
};

const EYE_COLORS = {
  brown: '#3a2f25',
  hazel: '#5b3a2e',  
  blue: '#1f2d57',
  green: '#0a6a4f'
};

// Seeded random number generator for consistent results
function SeededRNG(seed) {
  this.seed = seed;
}

SeededRNG.prototype.random = function() {
  this.seed = (this.seed * 9301 + 49297) % 233280;
  return this.seed / 233280;
};

SeededRNG.prototype.choice = function(array) {
  return array[Math.floor(this.random() * array.length)];
};

// Utility functions
function darken(hex, factor = 0.85) {
  const value = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, Math.round(((value >> 16) & 0xff) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((value >> 8) & 0xff) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((value & 0xff) * factor)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function lighten(hex, factor = 1.1) {
  const value = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, Math.round(((value >> 16) & 0xff) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((value >> 8) & 0xff) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((value & 0xff) * factor)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Generate random DNA from seed
function randomDNA(seed) {
  const rng = new SeededRNG(typeof seed === 'string' ? seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : seed);
  
  return {
    skin: rng.choice(['light', 'tan', 'brown', 'deep']),
    hairStyle: rng.choice(HAIR_STYLES),
    hairColor: rng.choice(Object.keys(HAIR_COLORS)),
    eyeColor: rng.choice(Object.keys(EYE_COLORS)),
    eyeShape: rng.choice(['round', 'almond', 'sleepy']),
    brows: rng.random() > 0.15,
    mouth: rng.choice(['neutral', 'smile', 'frown', 'smirk']),
    facial: rng.choice(['none', 'goatee', 'mustache']),
    accessory: rng.choice(['none', 'headband', 'cap'])
  };
}

// Render avatar to canvas
function renderAvatar(canvas, dna) {
  if (!canvas || !canvas.getContext) {
    console.error('Invalid canvas element provided to renderAvatar');
    return;
  }

  const ctx = canvas.getContext('2d');
  const size = Math.min(canvas.width, canvas.height);
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  ctx.fillStyle = '#2a2320';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Get colors
  const skin = SKIN_TONES[dna.skin] || SKIN_TONES.tan;
  const hairColor = HAIR_COLORS[dna.hairColor] || HAIR_COLORS.brown;
  const eyeColor = EYE_COLORS[dna.eyeColor] || EYE_COLORS.brown;
  
  // Head positioning
  const headCx = canvas.width / 2;
  const headCy = canvas.height * 0.45;
  const headRx = size * 0.22;
  const headRy = size * 0.28;
  
  // Draw neck
  ctx.fillStyle = skin.base;
  ctx.beginPath();
  ctx.ellipse(headCx, canvas.height * 0.8, headRx * 0.6, headRy * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw head base
  ctx.fillStyle = skin.base;
  ctx.beginPath();
  ctx.ellipse(headCx, headCy, headRx, headRy, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Add head shading
  ctx.fillStyle = skin.shadow;
  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.ellipse(headCx, headCy + headRy * 0.3, headRx * 0.6, headRy * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  
  // Draw hair (if not bald)
  if (dna.hairStyle !== 'bald') {
    drawHair(ctx, headCx, headCy, headRx, headRy, dna.hairStyle, hairColor, size);
  }
  
  // Draw eyes
  drawEyes(ctx, headCx, headCy, headRx, headRy, dna.eyeShape, eyeColor, size);
  
  // Draw eyebrows
  if (dna.brows) {
    drawBrows(ctx, headCx, headCy, headRx, headRy, hairColor, size);
  }
  
  // Draw nose
  drawNose(ctx, headCx, headCy, headRx, headRy, skin, size);
  
  // Draw mouth
  drawMouth(ctx, headCx, headCy, headRx, headRy, dna.mouth, skin, size);
  
  // Draw facial hair
  if (dna.facial && dna.facial !== 'none') {
    drawFacialHair(ctx, headCx, headCy, headRx, headRy, dna.facial, hairColor, size);
  }
}

function drawHair(ctx, cx, cy, rx, ry, style, color, size) {
  ctx.fillStyle = color.base;
  
  switch (style) {
    case 'short':
      ctx.beginPath();
      ctx.ellipse(cx, cy - ry * 0.2, rx * 1.1, ry * 0.8, 0, 0, Math.PI, true);
      ctx.fill();
      break;
      
    case 'curly':
      ctx.beginPath();
      ctx.ellipse(cx, cy - ry * 0.1, rx * 1.2, ry * 0.9, 0, 0, Math.PI, true);
      ctx.fill();
      // Add curly texture
      ctx.fillStyle = color.shine;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI;
        const x = cx + Math.cos(angle) * rx * 0.8;
        const y = cy - ry * 0.1 + Math.sin(angle) * ry * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.02, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
      
    case 'afro':
      ctx.beginPath();
      ctx.ellipse(cx, cy - ry * 0.1, rx * 1.4, ry * 1.1, 0, 0, Math.PI, true);
      ctx.fill();
      break;
      
    case 'buzz':
      ctx.beginPath();
      ctx.ellipse(cx, cy - ry * 0.3, rx * 1.05, ry * 0.7, 0, 0, Math.PI, true);
      ctx.fill();
      break;
      
    default: // short
      ctx.beginPath();
      ctx.ellipse(cx, cy - ry * 0.2, rx * 1.1, ry * 0.8, 0, 0, Math.PI, true);
      ctx.fill();
  }
}

function drawEyes(ctx, cx, cy, rx, ry, shape, color, size) {
  const eyeY = cy - ry * 0.1;
  const eyeOffset = rx * 0.4;
  const eyeRx = rx * 0.25;
  const eyeRy = ry * 0.15;
  
  // White of eyes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - eyeOffset, eyeY, eyeRx, eyeRy, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeOffset, eyeY, eyeRx, eyeRy, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Iris
  ctx.fillStyle = color;
  const irisRx = eyeRx * 0.6;
  const irisRy = eyeRy * 0.6;
  
  if (shape === 'almond') {
    // Almond shaped iris
    ctx.beginPath();
    ctx.ellipse(cx - eyeOffset, eyeY, irisRx * 0.8, irisRy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeOffset, eyeY, irisRx * 0.8, irisRy, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'sleepy') {
    // Sleepy/droopy iris
    ctx.beginPath();
    ctx.ellipse(cx - eyeOffset, eyeY + eyeRy * 0.1, irisRx, irisRy * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeOffset, eyeY + eyeRy * 0.1, irisRx, irisRy * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Round
    ctx.beginPath();
    ctx.ellipse(cx - eyeOffset, eyeY, irisRx, irisRy, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeOffset, eyeY, irisRx, irisRy, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Pupils
  ctx.fillStyle = '#000000';
  const pupilRadius = irisRx * 0.4;
  ctx.beginPath();
  ctx.arc(cx - eyeOffset, eyeY, pupilRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + eyeOffset, eyeY, pupilRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Eye highlights
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.8;
  const highlightRadius = pupilRadius * 0.4;
  ctx.beginPath();
  ctx.arc(cx - eyeOffset + pupilRadius * 0.3, eyeY - pupilRadius * 0.3, highlightRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + eyeOffset + pupilRadius * 0.3, eyeY - pupilRadius * 0.3, highlightRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawBrows(ctx, cx, cy, rx, ry, hairColor, size) {
  const browY = cy - ry * 0.3;
  const browOffset = rx * 0.35;
  
  ctx.strokeStyle = darken(hairColor.base, 0.9);
  ctx.lineWidth = size * 0.015;
  ctx.lineCap = 'round';
  
  // Left brow
  ctx.beginPath();
  ctx.moveTo(cx - browOffset - rx * 0.2, browY);
  ctx.quadraticCurveTo(cx - browOffset, browY - ry * 0.05, cx - browOffset + rx * 0.2, browY + ry * 0.02);
  ctx.stroke();
  
  // Right brow
  ctx.beginPath();
  ctx.moveTo(cx + browOffset - rx * 0.2, browY + ry * 0.02);
  ctx.quadraticCurveTo(cx + browOffset, browY - ry * 0.05, cx + browOffset + rx * 0.2, browY);
  ctx.stroke();
}

function drawNose(ctx, cx, cy, rx, ry, skin, size) {
  const noseY = cy + ry * 0.1;
  
  ctx.strokeStyle = darken(skin.shadow, 0.8);
  ctx.lineWidth = size * 0.01;
  ctx.lineCap = 'round';
  
  // Nose outline
  ctx.beginPath();
  ctx.moveTo(cx, noseY - ry * 0.1);
  ctx.quadraticCurveTo(cx - rx * 0.08, noseY + ry * 0.05, cx - rx * 0.06, noseY + ry * 0.1);
  ctx.stroke();
  
  // Nostril
  ctx.fillStyle = darken(skin.shadow, 0.7);
  ctx.beginPath();
  ctx.arc(cx - rx * 0.06, noseY + ry * 0.1, size * 0.008, 0, Math.PI * 2);
  ctx.fill();
}

function drawMouth(ctx, cx, cy, rx, ry, expression, skin, size) {
  const mouthY = cy + ry * 0.4;
  const mouthWidth = rx * 0.3;
  
  ctx.strokeStyle = darken(skin.shadow, 0.8);
  ctx.lineWidth = size * 0.015;
  ctx.lineCap = 'round';
  
  switch (expression) {
    case 'smile':
      ctx.beginPath();
      ctx.moveTo(cx - mouthWidth, mouthY);
      ctx.quadraticCurveTo(cx, mouthY + ry * 0.08, cx + mouthWidth, mouthY);
      ctx.stroke();
      break;
      
    case 'frown':
      ctx.beginPath();
      ctx.moveTo(cx - mouthWidth, mouthY);
      ctx.quadraticCurveTo(cx, mouthY - ry * 0.04, cx + mouthWidth, mouthY);
      ctx.stroke();
      break;
      
    case 'smirk':
      ctx.beginPath();
      ctx.moveTo(cx - mouthWidth, mouthY);
      ctx.quadraticCurveTo(cx + mouthWidth * 0.2, mouthY + ry * 0.04, cx + mouthWidth, mouthY - ry * 0.02);
      ctx.stroke();
      break;
      
    default: // neutral
      ctx.beginPath();
      ctx.moveTo(cx - mouthWidth, mouthY);
      ctx.lineTo(cx + mouthWidth, mouthY);
      ctx.stroke();
  }
}

function drawFacialHair(ctx, cx, cy, rx, ry, style, hairColor, size) {
  ctx.fillStyle = darken(hairColor.base, 0.9);
  
  switch (style) {
    case 'goatee':
      ctx.beginPath();
      ctx.ellipse(cx, cy + ry * 0.6, rx * 0.2, ry * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
      
    case 'mustache':
      ctx.beginPath();
      ctx.ellipse(cx, cy + ry * 0.25, rx * 0.25, ry * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
  }
}

// Create the global AvatarKit object
window.AvatarKit = {
  render: renderAvatar,
  randomDNA: randomDNA,
  
  // Additional helper function for compatibility
  dnaFromSeed: randomDNA
};

console.log('V2 Avatar System (proc-avatar.js) loaded successfully');