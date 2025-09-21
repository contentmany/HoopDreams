import React from 'react';

export type AvatarProps = {
  size?: number;
  title?: string;
};

export default function FallbackAvatar({ size = 96, title = 'Player' }: AvatarProps) {
  const safeSize = Math.max(24, size);

  return (
    <svg width={safeSize} height={safeSize} viewBox="0 0 64 64" role="img" aria-label={title}>
      <defs>
        <linearGradient id="fallback-avatar-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2a2a2a" />
          <stop offset="1" stopColor="#1c1c1c" />
        </linearGradient>
      </defs>

      <rect width="64" height="64" rx="12" fill="url(#fallback-avatar-gradient)" />
      <circle cx="32" cy="26" r="12" fill="#f1c27d" />
      <rect x="16" y="40" width="32" height="14" rx="7" fill="#e0b07c" />
    </svg>
  );
}
