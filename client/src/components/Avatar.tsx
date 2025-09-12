import { memo } from 'react';
import { AvatarData, AvatarStageSize, STAGE_DIMENSIONS, DEFAULT_AVATAR } from '@/types/avatar';
import { cn } from '@/lib/utils';

interface AvatarProps {
  stageSize: AvatarStageSize;
  avatarData?: AvatarData;
  className?: string;
}

const LAYER_ORDER = [
  'body',
  'head', 
  'hair',
  'facial_hair',
  'eyes',
  'brows',
  'nose',
  'mouth',
  'headband',
  'jersey',
  'shorts',
  'socks',
  'shoes',
  'accessories'
] as const;

export const Avatar = memo(({ stageSize, avatarData = DEFAULT_AVATAR, className }: AvatarProps) => {
  const { width, height } = STAGE_DIMENSIONS[stageSize];
  
  const getAssetPath = (layer: string, value: string) => {
    return `/assets/sprites/${layer}/${value}.png`;
  };
  
  const shouldShowLayer = (layer: string): boolean => {
    switch (layer) {
      case 'headband':
        return avatarData.headband.on;
      case 'facial_hair':
        return avatarData.facialHair !== 'none';
      default:
        return true;
    }
  };
  
  const getLayerStyle = (layer: string) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      imageRendering: 'pixelated',
      objectFit: 'contain'
    };
    
    // Apply color tinting for certain layers
    switch (layer) {
      case 'jersey':
        return {
          ...baseStyle,
          filter: `hue-rotate(${getHueRotation(avatarData.jerseyColor)}deg) saturate(1.2)`
        };
      case 'shorts':
        return {
          ...baseStyle,
          filter: `hue-rotate(${getHueRotation(avatarData.shortsColor)}deg) saturate(1.2)`
        };
      case 'shoes':
        return {
          ...baseStyle,
          filter: `hue-rotate(${getHueRotation(avatarData.shoesColor)}deg) saturate(1.2)`
        };
      case 'headband':
        return {
          ...baseStyle,
          filter: `hue-rotate(${getHueRotation(avatarData.headband.color)}deg) saturate(1.2)`
        };
      case 'hair':
        return {
          ...baseStyle,
          filter: `hue-rotate(${getHueRotation(avatarData.hairColor)}deg) saturate(1.2)`
        };
      default:
        return baseStyle;
    }
  };
  
  const getHueRotation = (color: string): number => {
    // Simple hue rotation calculation based on hex color
    // This is a placeholder - in production you'd use proper color conversion
    const colorMap: Record<string, number> = {
      '#7a5bff': 0,   // purple (baseline)
      '#ff5b5b': 120, // red
      '#5bff5b': 240, // green
      '#5b5bff': 60,  // blue
      '#ffff5b': 180, // yellow
      '#ff5bff': 300, // magenta
      '#5bffff': 210, // cyan
      '#ffffff': 0,   // white
      '#000000': 0,   // black
    };
    return colorMap[color] || 0;
  };
  
  const getLayerValue = (layer: string): string => {
    switch (layer) {
      case 'body':
      case 'head':
        return avatarData.skinTone;
      case 'hair':
        return avatarData.hairStyle;
      case 'facial_hair':
        return avatarData.facialHair;
      case 'eyes':
        return avatarData.eyes;
      case 'brows':
        return avatarData.brows;
      case 'nose':
        return avatarData.nose;
      case 'mouth':
        return avatarData.mouth;
      case 'headband':
        return 'default';
      case 'jersey':
        return 'default';
      case 'shorts':
        return 'default';
      case 'socks':
        return 'default';
      case 'shoes':
        return 'default';
      case 'accessories':
        return 'none';
      default:
        return 'default';
    }
  };

  return (
    <div 
      className={cn(
        "avatarStage relative overflow-hidden",
        className
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,.25)'
      }}
    >
      {LAYER_ORDER.map((layer) => {
        if (!shouldShowLayer(layer)) return null;
        
        const value = getLayerValue(layer);
        const assetPath = getAssetPath(layer, value);
        
        return (
          <img
            key={layer}
            src={assetPath}
            alt=""
            style={getLayerStyle(layer)}
            onError={(e) => {
              // Hide broken images gracefully
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        );
      })}
    </div>
  );
});

Avatar.displayName = 'Avatar';