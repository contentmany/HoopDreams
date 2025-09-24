import React from "react";

type Variant = "full" | "face" | "mini";

function getSpriteUrl(): string {
  try {
    const saved = JSON.parse(localStorage.getItem("player") || "{}");
    return saved?.appearance?.spriteUrl || "/assets/sprites/generic_player.png";
  } catch {
    return "/assets/sprites/generic_player.png";
  }
}

export default function PlayerSprite({ variant = "face", alt = "Player" }: { variant?: Variant; alt?: string }) {
  const src = getSpriteUrl();
  const base = "hd-sprite-img";

  if (variant === "full") {
    return (
      <div className="hd-sprite hd-sprite--full">
        <img className={base} src={src} alt={alt} />
      </div>
    );
  }
  if (variant === "mini") {
    return (
      <div className="hd-sprite hd-sprite--mini">
        <img className={base + " hd-sprite--head"} src={src} alt={alt} />
      </div>
    );
  }
  // face (default)
  return (
    <div className="hd-sprite hd-sprite--face">
      <img className={base + " hd-sprite--head"} src={src} alt={alt} />
    </div>
  );
}