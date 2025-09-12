import { useState, useEffect, useMemo } from 'react';
import { composeAvatar, randomAvatar, AvatarParts, TeamColors } from '@/lib/avatar';

interface AssetAvatarProps {
  parts?: AvatarParts;
  seed?: string;
  size?: 's192' | 's64' | 's40' | 's24';
  teamColor?: string;
  className?: string;
  'data-testid'?: string;
}

export default function AssetAvatar({ 
  parts, 
  seed, 
  size = 's64', 
  teamColor,
  className = '',
  'data-testid': testId
}: AssetAvatarProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize parts generation to prevent unnecessary re-renders
  const memoizedParts = useMemo(() => {
    if (parts) return parts;
    return null; // Will be generated in effect
  }, [parts]);

  useEffect(() => {
    async function generateAvatar() {
      try {
        setLoading(true);
        setError(null);
        
        let avatarParts: AvatarParts;
        let composedUrl: string;
        
        if (memoizedParts) {
          // Use provided parts
          avatarParts = memoizedParts;
          composedUrl = await composeAvatar(avatarParts, teamColor, getSizePixels(size));
        } else if (seed) {
          // Generate from seed
          const generated = await randomAvatar(seed, teamColor);
          avatarParts = generated.parts;
          composedUrl = generated.dataUrl;
        } else {
          // Generate random
          const generated = await randomAvatar(undefined, teamColor);
          avatarParts = generated.parts;
          composedUrl = generated.dataUrl;
        }
        
        setDataUrl(composedUrl);
      } catch (err) {
        console.error('Failed to generate avatar:', err);
        setError('Failed to load avatar');
      } finally {
        setLoading(false);
      }
    }
    
    generateAvatar();
  }, [memoizedParts, seed, teamColor, size]);

  const getSizePixels = (sizeClass: string): number => {
    const sizeMap = {
      's192': 192,
      's64': 64, 
      's40': 40,
      's24': 24
    };
    return sizeMap[sizeClass as keyof typeof sizeMap] || 64;
  };

  if (loading) {
    return (
      <div className={`avatar ${size} ${className}`} data-testid={testId}>
        <div className="w-full h-full bg-muted/10 animate-pulse rounded" />
      </div>
    );
  }

  if (error || !dataUrl) {
    return (
      <div className={`avatar ${size} ${className}`} data-testid={testId}>
        <div className="w-full h-full bg-muted/20 flex items-center justify-center text-muted-foreground text-xs">
          ?
        </div>
      </div>
    );
  }

  return (
    <div className={`avatar ${size} ${className}`} data-testid={testId}>
      <img 
        src={dataUrl} 
        alt="avatar" 
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}