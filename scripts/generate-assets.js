import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple PNG creation using Canvas API (if available) or fallback method
function createBasicPNG(width = 512, height = 512, shapes = []) {
  // Create a simple PNG data URL for basic shapes
  // This is a simplified approach for demonstration
  
  const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="transparent"/>
      ${shapes.map(shape => {
        if (shape.type === 'oval') {
          return `<ellipse cx="${shape.cx}" cy="${shape.cy}" rx="${shape.rx}" ry="${shape.ry}" fill="${shape.fill}" opacity="${shape.opacity || 1}"/>`;
        }
        if (shape.type === 'rect') {
          return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="${shape.fill}" opacity="${shape.opacity || 1}"/>`;
        }
        if (shape.type === 'path') {
          return `<path d="${shape.d}" fill="${shape.fill}" opacity="${shape.opacity || 1}"/>`;
        }
        if (shape.type === 'circle') {
          return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.r}" fill="${shape.fill}" opacity="${shape.opacity || 1}"/>`;
        }
        return '';
      }).join('')}
    </svg>
  `;
  
  return canvas;
}

// Skin tone colors from manifest
const skinTones = {
  'f1': '#F4C29A',
  'f2': '#E1A06E',
  'f3': '#C77D4C',
  'f4': '#A45B36',
  'f5': '#7A422A',
  'f6': '#4F2E22'
};

const eyeColors = {
  'brown': '#8B4513',
  'dark_brown': '#654321',
  'hazel': '#8E7618',
  'green': '#228B22',
  'gray': '#808080',
  'amber': '#FFBF00'
};

// Generate assets
async function generateAssets() {
  const baseDir = path.join(__dirname, '../public/avatars');
  
  console.log('Generating avatar assets...');
  
  // 1. Base heads
  console.log('Generating base heads...');
  Object.entries(skinTones).forEach(([tone, color]) => {
    const svg = createBasicPNG(512, 512, [
      {
        type: 'oval',
        cx: 256,
        cy: 256,
        rx: 180,
        ry: 200,
        fill: color
      }
    ]);
    
    fs.writeFileSync(
      path.join(baseDir, 'base', `head_base_${tone}_neutral.svg`),
      svg
    );
  });
  
  // 2. Hair styles
  console.log('Generating hair styles...');
  const hairStyles = [
    {
      name: 'bald',
      shapes: [] // Empty for bald
    },
    {
      name: 'short',
      shapes: [{
        type: 'path',
        d: 'M 120 180 Q 256 120 392 180 L 380 220 L 132 220 Z',
        fill: '#2B1B17'
      }]
    },
    {
      name: 'fade',
      shapes: [{
        type: 'path',
        d: 'M 140 190 Q 256 140 372 190 L 360 210 L 152 210 Z',
        fill: '#2B1B17'
      }]
    },
    {
      name: 'waves',
      shapes: [{
        type: 'path',
        d: 'M 110 200 Q 180 150 256 160 Q 332 150 402 200 L 390 230 L 122 230 Z',
        fill: '#2B1B17'
      }]
    },
    {
      name: 'low_cut',
      shapes: [{
        type: 'path',
        d: 'M 150 200 Q 256 160 362 200 L 350 220 L 162 220 Z',
        fill: '#2B1B17'
      }]
    }
  ];
  
  hairStyles.forEach(style => {
    const svg = createBasicPNG(512, 512, style.shapes);
    fs.writeFileSync(
      path.join(baseDir, 'hair', `hair_${style.name}.svg`),
      svg
    );
  });
  
  // 3. Eyes
  console.log('Generating eyes...');
  const eyeStyles = [
    {
      shape: 'round',
      color: 'brown',
      shapes: [
        // Left eye white
        { type: 'circle', cx: 200, cy: 256, r: 25, fill: 'white' },
        // Right eye white
        { type: 'circle', cx: 312, cy: 256, r: 25, fill: 'white' },
        // Left iris
        { type: 'circle', cx: 200, cy: 256, r: 15, fill: eyeColors.brown },
        // Right iris
        { type: 'circle', cx: 312, cy: 256, r: 15, fill: eyeColors.brown },
        // Left pupil
        { type: 'circle', cx: 200, cy: 256, r: 8, fill: 'black' },
        // Right pupil
        { type: 'circle', cx: 312, cy: 256, r: 8, fill: 'black' }
      ]
    },
    {
      shape: 'almond',
      color: 'green',
      shapes: [
        // Left eye almond shape
        { type: 'oval', cx: 200, cy: 256, rx: 30, ry: 15, fill: 'white' },
        // Right eye almond shape
        { type: 'oval', cx: 312, cy: 256, rx: 30, ry: 15, fill: 'white' },
        // Left iris
        { type: 'circle', cx: 200, cy: 256, r: 12, fill: eyeColors.green },
        // Right iris
        { type: 'circle', cx: 312, cy: 256, r: 12, fill: eyeColors.green },
        // Left pupil
        { type: 'circle', cx: 200, cy: 256, r: 6, fill: 'black' },
        // Right pupil
        { type: 'circle', cx: 312, cy: 256, r: 6, fill: 'black' }
      ]
    }
  ];
  
  eyeStyles.forEach(style => {
    const svg = createBasicPNG(512, 512, style.shapes);
    fs.writeFileSync(
      path.join(baseDir, 'eyes', `eyes_${style.shape}_${style.color}.svg`),
      svg
    );
  });
  
  // 4. Brows
  console.log('Generating brows...');
  const browStyles = [
    {
      name: 'straight',
      shapes: [
        { type: 'rect', x: 175, y: 210, width: 50, height: 8, fill: '#2B1B17' },
        { type: 'rect', x: 287, y: 210, width: 50, height: 8, fill: '#2B1B17' }
      ]
    },
    {
      name: 'soft_arc',
      shapes: [
        { type: 'path', d: 'M 175 215 Q 200 205 225 215 L 225 223 L 175 223 Z', fill: '#2B1B17' },
        { type: 'path', d: 'M 287 215 Q 312 205 337 215 L 337 223 L 287 223 Z', fill: '#2B1B17' }
      ]
    }
  ];
  
  browStyles.forEach(style => {
    const svg = createBasicPNG(512, 512, style.shapes);
    fs.writeFileSync(
      path.join(baseDir, 'brows', `brows_${style.name}.svg`),
      svg
    );
  });
  
  // 5. Mouths
  console.log('Generating mouths...');
  const mouthStyles = [
    {
      name: 'neutral',
      shapes: [
        { type: 'rect', x: 230, y: 320, width: 52, height: 4, fill: '#8B4513' }
      ]
    },
    {
      name: 'smile_soft',
      shapes: [
        { type: 'path', d: 'M 230 325 Q 256 315 282 325 L 282 329 L 230 329 Z', fill: '#8B4513' }
      ]
    }
  ];
  
  mouthStyles.forEach(style => {
    const svg = createBasicPNG(512, 512, style.shapes);
    fs.writeFileSync(
      path.join(baseDir, 'mouth', `mouth_${style.name}.svg`),
      svg
    );
  });
  
  // 6. Masks
  console.log('Generating masks...');
  const maskStyles = [
    {
      name: 'headband_narrow_mask',
      shapes: [
        { type: 'rect', x: 120, y: 180, width: 272, height: 25, fill: 'white' }
      ]
    },
    {
      name: 'beanie_mask',
      shapes: [
        { type: 'path', d: 'M 120 200 Q 256 140 392 200 L 380 240 L 132 240 Z', fill: 'white' }
      ]
    }
  ];
  
  maskStyles.forEach(style => {
    const svg = createBasicPNG(512, 512, style.shapes);
    fs.writeFileSync(
      path.join(baseDir, 'masks', `${style.name}.svg`),
      svg
    );
  });
  
  console.log('Avatar assets generated successfully!');
  console.log('Note: Generated as SVG files. You may need to convert to PNG for production use.');
}

// Create directories if they don't exist
function ensureDirectories() {
  const dirs = ['base', 'hair', 'eyes', 'brows', 'mouth', 'masks', 'accessory', 'beard'];
  const baseDir = path.join(__dirname, '../public/avatars');
  
  dirs.forEach(dir => {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

ensureDirectories();
generateAssets();