// Re-export improved avatar system with proper client-side wrapper
import { 
  composeAvatar as rootComposeAvatar,
  randomAvatar as rootRandomAvatar,
  loadAvatarAssets as rootLoadAvatarAssets,
  renderAvatar as rootRenderAvatar,
  AvatarParts,
  TeamColors
} from '../../../src/lib/avatar';

export const composeAvatar = rootComposeAvatar;
export const randomAvatar = rootRandomAvatar;
export const loadAvatarAssets = rootLoadAvatarAssets; 
export const renderAvatar = rootRenderAvatar;
export type { AvatarParts, TeamColors };