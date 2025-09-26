import React from "react";
import { useGameStore } from "@/state/gameStore";

// Simple inline gray silhouette (SVG) fallback
const SILHOUETTE_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="64" ry="64" fill="#3a3a3a"/>
    <circle cx="64" cy="46" r="26" fill="#8a8a8a"/>
    <path d="M16 120c0-26 21-47 48-47s48 21 48 47" fill="#8a8a8a"/>
  </svg>`);

export function getStoredAvatarUrl(): string {
  const fromStore = useGameStore.getState().career.player.photo;
  return fromStore || SILHOUETTE_DATA_URL;
}

type AvatarPhotoProps = {
  size?: number;           // px, default 72
  className?: string;
  alt?: string;
};

export default function AvatarPhoto({ size = 72, className = "", alt = "Avatar" }: AvatarPhotoProps) {
  const photo = useGameStore(state => state.career.player.photo);
  const src = photo || SILHOUETTE_DATA_URL;
  const px = `${size}px`;
  
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover object-center aspect-square border border-zinc-700 ${className}`}
      style={{ width: px, height: px }}
      draggable={false}
    />
  );
}