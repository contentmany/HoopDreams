import React from 'react';
import FallbackAvatar from '../avatar/FallbackAvatar';

export type PixelAvatarProps = {
  size?: number;
  skin?: string;
  hairId?: string;
  hairColor?: string;
};

export const PixelAvatar: React.FC<PixelAvatarProps> = ({ size }) => (
  <FallbackAvatar size={size} title="Pixel Avatar" />
);

export default PixelAvatar;
