// Re-export from root lib/avatar with proper client-side wrapper
import { 
  composeAvatar as rootComposeAvatar,
  randomAvatar as rootRandomAvatar,
  loadAvatarAssets as rootLoadAvatarAssets,
  tintMask as rootTintMask,
  AvatarParts
} from '../../../src/lib/avatar';
import { hexToRgb } from '../../../src/lib/color';

// Client-side wrapper that handles team colors properly
export async function composeAvatar(parts: AvatarParts, teamColor?: string): Promise<string> {
  // Forward teamColor to root composeAvatar for proper tinting
  return rootComposeAvatar(parts, teamColor);
}

export const randomAvatar = rootRandomAvatar;
export const loadAvatarAssets = rootLoadAvatarAssets; 
export const tintMask = rootTintMask;
export type { AvatarParts };

let cachedManifest: any = null;

export async function getManifest() {
  if (cachedManifest) return cachedManifest;
  
  try {
    await loadAvatarAssets();
    const response = await fetch('/avatars/manifest.json');
    cachedManifest = await response.json();
    return cachedManifest;
  } catch (error) {
    console.error('Failed to load avatar manifest:', error);
    throw error;
  }
}