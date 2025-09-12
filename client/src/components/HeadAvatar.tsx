import { useEffect, useState } from 'react';
import type { AvatarDNA } from '@/avatar/types';
import { createAvatar, randomAvatar } from '@/avatar';
import { avatarCache } from '@/avatar/cache';

interface HeadAvatarProps {
  dna?: AvatarDNA;
  seed?: number;
  size?: number;
  className?: string;
  variant?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function HeadAvatar({ 
  dna, 
  seed, 
  size, 
  className = '', 
  variant = 'md' 
}: HeadAvatarProps) {
  const [dataURL, setDataURL] = useState<string>('');
  
  // Determine final size from variant if not provided
  const finalSize = size || getSizeFromVariant(variant);
  
  useEffect(() => {
    let avatar;
    let useSeed = seed || dna?.seed || 0;
    
    // Check cache first if using seed
    if (!dna && seed !== undefined) {
      const cached = avatarCache.get(seed, finalSize);
      if (cached) {
        setDataURL(cached);
        return;
      }
    }
    
    // Generate avatar
    if (dna) {
      avatar = createAvatar(dna);
    } else {
      avatar = randomAvatar(useSeed);
    }
    
    const url = avatar.toDataURL(finalSize);
    setDataURL(url);
    
    // Cache if using seed
    if (!dna && seed !== undefined) {
      avatarCache.set(seed, finalSize, url);
    }
  }, [dna, seed, finalSize]);
  
  const variantClass = `av-${variant}`;
  
  return (
    <div className={`${variantClass} ${className}`}>
      {dataURL && (
        <img 
          src={dataURL} 
          alt="Avatar" 
          className="avatar-img"
        />
      )}
    </div>
  );
}

function getSizeFromVariant(variant: string): number {
  switch (variant) {
    case 'xxs': return 28;
    case 'xs': return 40;
    case 'sm': return 56;
    case 'md': return 72;
    case 'lg': return 96;
    case 'xl': return 128;
    case '2xl': return 160;
    default: return 72;
  }
}