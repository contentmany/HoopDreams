import React from "react";

type Props = {
  size?: number;      // px
  rounded?: number;   // border radius in px
  storageKey?: string;
  className?: string;
};

const SILHOUETTE_SVG = encodeURIComponent(`
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" fill="#0b1220"/>
  <circle cx="128" cy="96" r="52" fill="#1f2a44"/>
  <path d="M44 224c0-46 38-70 84-70s84 24 84 70" fill="#1f2a44"/>
</svg>`);

export default function AvatarOrPhoto({
  size = 112,
  rounded = 16,
  storageKey = "player.avatar.v1",
  className,
}: Props) {
  const [src, setSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setSrc(saved);
    } catch {}
  }, [storageKey]);

  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: rounded,
    overflow: "hidden",
    display: "block",
    background: "#0b1220",
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
    objectFit: "cover",
  };

  const imgSrc =
    src ??
    `data:image/svg+xml;charset=utf-8,${SILHOUETTE_SVG}`;

  return (
    <img
      src={imgSrc}
      alt="Player avatar"
      style={style}
      className={className}
    />
  );
}