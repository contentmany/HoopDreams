import React, { useRef, useState } from "react";
import { saveAvatar, clearAvatar, loadAvatar } from "@/utils/avatarStore";

function centerCropToSquare(img: HTMLImageElement, size = 512): string {
  const s = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = Math.max(0, (img.naturalWidth - s) / 2);
  const sy = Math.max(0, (img.naturalHeight - s) / 2);
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d")!;
  g.imageSmoothingEnabled = true;
  g.drawImage(img, sx, sy, s, s, 0, 0, size, size);
  return c.toDataURL("image/png");
}

export default function AvatarUploader(){
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [current, setCurrent] = useState(loadAvatar()?.dataUrl ?? "");

  function pickFile(){
    inputRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const sq = centerCropToSquare(img, 512);
        saveAvatar(sq);
        setCurrent(sq);
      } finally {
        setBusy(false);
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      setBusy(false);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function remove(){
    clearAvatar();
    setCurrent("");
  }

  const circle: React.CSSProperties = {
    width: 160,
    height: 160,
    borderRadius: "50%",
    overflow: "hidden",
    background: "#151515",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 0 0 2px rgba(255,255,255,0.08) inset"
  };

  return (
    <div>
      <div style={circle}>
        {current ? (
          <img
            src={current}
            alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ opacity: 0.7, fontSize: 48 }}>🙂</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={pickFile} disabled={busy} style={{ padding: "8px 12px" }}>
          Choose Photo
        </button>
        <button
          onClick={remove}
          disabled={!current || busy}
          style={{ padding: "8px 12px" }}
        >
          Remove
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={onFile}
      />

      <p style={{ opacity: 0.7, marginTop: 12, maxWidth: 480 }}>
        Your photo is <b>stored only on this device</b> (localStorage). We auto-crop to a centered square and render as a
        circle so it never blocks UI.
      </p>
    </div>
  );
}
