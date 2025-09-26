import React from "react";
 feat/photo-avatar
import AvatarOrPhoto from "@/components/AvatarOrPhoto";

import AvatarImage from "@/features/avatar/AvatarImage";
 main

type Variant = "full" | "face" | "mini";

export default function PlayerSprite({ variant = "face", alt = "Player" }: { variant?: Variant; alt?: string }) {
  // Map variants to sizes similar to old CSS boxes
  const size = variant === "full" ? 128 : variant === "mini" ? 24 : 56;
  const radius = variant === "full" ? 8 : variant === "mini" ? 4 : 8;
 feat/photo-avatar
  return <AvatarOrPhoto size={size} rounded={radius} />;

  return <AvatarImage size={size} className={radius ? "rounded-full" : ""} />;
 main
}