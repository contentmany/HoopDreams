import { type Appearance, SKIN_COLORS, HAIR_COLORS } from "@/types/appearance";

interface CharacterPreviewProps {
  size?: 'sm' | 'lg';
  appearance: Appearance;
  teamColor?: string;
  className?: string;
}

export default function CharacterPreview({ 
  size = 'sm', 
  appearance, 
  teamColor = '#7A5BFF',
  className = "" 
}: CharacterPreviewProps) {
  const containerSize = size === 'lg' ? 'w-32 h-40' : 'w-16 h-20';
  const pixelSize = size === 'lg' ? 128 : 64;
  
  // Get colors based on appearance
  const skinColor = SKIN_COLORS[appearance.skinTone as keyof typeof SKIN_COLORS];
  const hairColor = HAIR_COLORS[appearance.hairColor];
  
  // Jersey color based on selection
  const getJerseyColor = () => {
    switch (appearance.jersey) {
      case 1: return '#6B7280'; // Neutral gray
      case 2: return teamColor; // Team A (use team color)
      case 3: return '#EF4444'; // Team B (red)
      case 4: return '#FFFFFF'; // White
      default: return '#6B7280';
    }
  };
  
  const jerseyColor = getJerseyColor();
  
  // Headband color
  const getHeadbandColor = () => {
    switch (appearance.headband) {
      case 1: return 'transparent'; // None
      case 2: return '#FFFFFF'; // White
      case 3: return '#000000'; // Black
      case 4: return teamColor; // Team
      default: return 'transparent';
    }
  };
  
  const headbandColor = getHeadbandColor();
  
  // New accessory system
  const shouldShowAccessory = appearance.accessory === 'headband';
  const accessoryColor = appearance.accessoryColor || '#FFFFFF';
  
  // Helper function for color tinting - converts hex to hue value
  const hexToHue = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16) / 255;
    const g = parseInt(hex.substr(3, 2), 16) / 255;
    const b = parseInt(hex.substr(5, 2), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    if (diff === 0) return 0;
    
    let hue = 0;
    if (max === r) {
      hue = ((g - b) / diff) % 6;
    } else if (max === g) {
      hue = (b - r) / diff + 2;
    } else {
      hue = (r - g) / diff + 4;
    }
    
    return Math.round(hue * 60);
  };
  
  return (
    <div 
      className={`pixel relative ${containerSize} ${className}`}
      style={{ 
        width: pixelSize,
        height: pixelSize * 1.25,
        imageRendering: 'pixelated'
      }}
    >
      {/* Base Body/Jersey - Bottom layer */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 border-2 border-gray-800"
        style={{ 
          backgroundColor: jerseyColor,
          borderRadius: '0 0 8px 8px'
        }}
      />
      
      {/* Head/Face - Middle layer */}
      <div
        className="absolute inset-x-0 top-0 h-3/5 border-2 border-gray-800"
        style={{ 
          backgroundColor: skinColor,
          borderRadius: '50% 50% 20% 20%'
        }}
      />
      
      {/* Hair - Top layer (if not bald) */}
      {appearance.hairStyle !== 10 && (
        <div
          className="absolute inset-x-0 top-0 h-2/5 border-2 border-gray-800"
          style={{ 
            backgroundColor: hairColor,
            borderRadius: appearance.hairStyle === 3 ? '50%' : '50% 50% 0 0', // Afro is rounder
            transform: appearance.hairStyle === 3 ? 'scale(1.2)' : 'none', // Afro is bigger
            zIndex: 1
          }}
        />
      )}
      
      {/* Old Headband - Top layer */}
      {appearance.headband !== 1 && (
        <div
          className="absolute inset-x-0 border border-gray-800"
          style={{ 
            backgroundColor: headbandColor,
            top: size === 'lg' ? '25%' : '20%',
            height: size === 'lg' ? '8px' : '4px',
            zIndex: 2
          }}
        />
      )}
      
      {/* New Accessory Headband - Above hair */}
      {shouldShowAccessory && (
        <div
          className="absolute inset-x-0 border border-gray-800"
          style={{ 
            backgroundColor: accessoryColor,
            top: size === 'lg' ? '22%' : '18%',
            height: size === 'lg' ? '10px' : '5px',
            zIndex: 3,
            borderRadius: '2px'
          }}
        />
      )}
      
      {/* Eyes - Top layer */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex gap-1" style={{ marginTop: size === 'lg' ? '12px' : '6px' }}>
          <div 
            className="bg-black"
            style={{ 
              width: size === 'lg' ? '4px' : '2px',
              height: size === 'lg' ? '4px' : '2px',
              borderRadius: appearance.eyes === 3 ? '50%' : '0' // Soft eyes are round
            }}
          />
          <div 
            className="bg-black"
            style={{ 
              width: size === 'lg' ? '4px' : '2px',
              height: size === 'lg' ? '4px' : '2px',
              borderRadius: appearance.eyes === 3 ? '50%' : '0'
            }}
          />
        </div>
      </div>
    </div>
  );
}