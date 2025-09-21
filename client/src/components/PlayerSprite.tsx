import React from "react";
import AvatarOrFallback from "../components/AvatarOrFallback";

type Variant = "full" | "face" | "mini";

export default function PlayerSprite({ variant = "face", alt = "Player", name = "Player", pixelProps = {} }: { variant?: Variant; alt?: string; name?: string; pixelProps?: Record<string, any> }) {
  // You can customize pixelProps or name as needed, or pull from localStorage if required
  const size = variant === "full" ? 160 : variant === "mini" ? 64 : 112;
  return (
    <div className={`hd-sprite hd-sprite--${variant}`}>
      <AvatarOrFallback name={name || alt} size={size} pixelProps={pixelProps} />
    </div>
  );
}