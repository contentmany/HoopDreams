import { useEffect, useState } from "react";

export interface AppearanceData {
  skinTone: 'light' | 'tan' | 'brown' | 'dark';
  hairStyle: 'short' | 'fade' | 'afro' | 'braids' | 'buzz' | 'curly';
  hairColor: 'black' | 'brown' | 'dark-blonde' | 'red';
  facialHair: 'none' | 'goatee' | 'stubble';
  headband: {
    on: boolean;
    color: string;
  };
}

interface AvatarPreviewProps {
  size?: 'small' | 'medium' | 'large';
  appearance?: AppearanceData;
  className?: string;
  slotId?: number;
}

const DEFAULT_APPEARANCE: AppearanceData = {
  skinTone: 'tan',
  hairStyle: 'short',
  hairColor: 'black',
  facialHair: 'none',
  headband: { on: false, color: '#7A5BFF' }
};

const SKIN_COLORS = {
  light: '#F4C2A1',
  tan: '#D4A574',
  brown: '#A67C52',
  dark: '#8B4513'
};

const HAIR_COLORS = {
  black: '#2C1810',
  brown: '#5D4037',
  'dark-blonde': '#8D6E63',
  red: '#A0522D'
};

export default function AvatarPreview({ 
  size = 'medium',
  appearance,
  className = "",
  slotId
}: AvatarPreviewProps) {
  const [avatarData, setAvatarData] = useState<AppearanceData>(DEFAULT_APPEARANCE);

  useEffect(() => {
    if (appearance) {
      setAvatarData(appearance);
    } else if (slotId) {
      // Load appearance from save slot
      const slotsData = localStorage.getItem('hd:saveSlots');
      if (slotsData) {
        try {
          const slots = JSON.parse(slotsData);
          const slot = slots[slotId - 1];
          if (slot?.player?.appearance) {
            setAvatarData(slot.player.appearance);
          } else {
            // Fallback to global appearance for existing saves
            const stored = localStorage.getItem('hd:appearance');
            if (stored) {
              setAvatarData(JSON.parse(stored));
            }
          }
        } catch (e) {
          console.warn('Failed to parse save slot data:', e);
        }
      }
    } else {
      // Load from global localStorage
      const stored = localStorage.getItem('hd:appearance');
      if (stored) {
        try {
          setAvatarData(JSON.parse(stored));
        } catch (e) {
          console.warn('Failed to parse stored appearance data:', e);
        }
      }
    }
  }, [appearance, slotId]);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const sizeStyles = {
    small: 32,
    medium: 64,
    large: 96
  };

  const currentSize = sizeStyles[size];

  return (
    <div 
      className={`${sizeClasses[size]} ${className} relative overflow-hidden rounded-full border-2 border-card-border bg-card`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Base (face) */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: SKIN_COLORS[avatarData.skinTone] }}
      />
      
      {/* Hair */}
      <div 
        className="absolute inset-x-2 top-1 h-4 rounded-t-full"
        style={{ 
          backgroundColor: HAIR_COLORS[avatarData.hairColor],
          height: `${currentSize * 0.4}px`,
          borderRadius: avatarData.hairStyle === 'afro' ? '50%' : '50% 50% 0 0'
        }}
      />
      
      {/* Eyes */}
      <div className="absolute flex space-x-1" style={{ 
        top: `${currentSize * 0.35}px`, 
        left: `${currentSize * 0.3}px` 
      }}>
        <div 
          className="bg-black rounded-full"
          style={{ 
            width: `${currentSize * 0.08}px`, 
            height: `${currentSize * 0.08}px` 
          }}
        />
        <div 
          className="bg-black rounded-full"
          style={{ 
            width: `${currentSize * 0.08}px`, 
            height: `${currentSize * 0.08}px` 
          }}
        />
      </div>
      
      {/* Facial Hair */}
      {avatarData.facialHair !== 'none' && (
        <div 
          className="absolute rounded-b-full"
          style={{
            backgroundColor: HAIR_COLORS[avatarData.hairColor],
            bottom: `${currentSize * 0.25}px`,
            left: `${currentSize * 0.35}px`,
            width: `${currentSize * 0.3}px`,
            height: `${currentSize * 0.15}px`,
            opacity: avatarData.facialHair === 'stubble' ? 0.7 : 1
          }}
        />
      )}
      
      {/* Headband */}
      {avatarData.headband.on && (
        <div 
          className="absolute rounded-full"
          style={{
            backgroundColor: avatarData.headband.color,
            top: `${currentSize * 0.1}px`,
            left: `${currentSize * 0.1}px`,
            right: `${currentSize * 0.1}px`,
            height: `${currentSize * 0.15}px`
          }}
        />
      )}
    </div>
  );
}