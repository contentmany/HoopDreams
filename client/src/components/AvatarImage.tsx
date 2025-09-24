import React from "react";
import { loadAvatar } from "@/utils/avatarStore";

type Props = { size?: number };

export default function AvatarImage({ size = 96 }: Props){
  const rec = loadAvatar();
  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    background: "#1b1b1b",
    display: "grid",
    placeItems: "center",
    overflow: "hidden",
    userSelect: "none"
  };

  if (!rec?.dataUrl) {
    return (
      <div style={style} aria-label="No avatar">
        🙂
      </div>
    );
  }
  return (
    <div style={style} aria-label="Avatar">
      <img
        src={rec.dataUrl}
        alt="avatar"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}
