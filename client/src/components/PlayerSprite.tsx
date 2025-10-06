import React from "react";
import AvatarPhoto from "@/components/AvatarPhoto";

type Variant = "full" | "face" | "mini";

export default function PlayerSprite({ variant = "face", alt = "Player" }: { variant?: Variant; alt?: string }) {
  // Map variants to sizes similar to old CSS boxes
  const size = variant === "full" ? 128 : variant === "mini" ? 24 : 56;
  
  return <AvatarPhoto size={size} />;
}