import React from "react";

type PhotoAvatarProps = {
  storageKey?: string; // localStorage key
  onSaved?: () => void; // callback after save
  size?: number; // preview size (px)
  bg?: string; // checker bg
};

function drawCroppedSquare(img: HTMLImageElement, zoom: number, outSize: number): string {
  const W = img.naturalWidth || img.width;
  const H = img.naturalHeight || img.height;
  const scale = Math.max(1, Math.min(zoom, 5)); // clamp
  const drawW = W * scale;
  const drawH = H * scale;

  // Center the scaled image
  const cx = W / 2;
  const cy = H / 2;
  const dx = cx - drawW / 2;
  const dy = cy - drawH / 2;

  // Target square is the min of (scaled dims)
  const square = Math.min(drawW, drawH);
  const off = document.createElement("canvas");
  off.width = square;
  off.height = square;
  const g = off.getContext("2d")!;
  g.imageSmoothingEnabled = true;
  g.drawImage(img, dx, dy, drawW, drawH);

  // Scale to outSize x outSize
  const out = document.createElement("canvas");
  out.width = outSize;
  out.height = outSize;
  const go = out.getContext("2d")!;
  go.imageSmoothingEnabled = true;
  go.drawImage(off, 0, 0, square, square, 0, 0, outSize, outSize);
  return out.toDataURL("image/jpeg", 0.9);
}

export default function PhotoAvatar({
  storageKey = "player.avatar.v1",
  onSaved,
  size = 256,
  bg = "repeating-conic-gradient(#e5e7eb 0% 25%, #f8fafc 0% 50%) 50% / 24px 24px",
}: PhotoAvatarProps) {
  const [fileUrl, setFileUrl] = React.useState<string | null>(null);
  const [zoom, setZoom] = React.useState<number>(1.4);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setFileUrl(url);
  };

  const onSave = () => {
    const img = imgRef.current;
    if (!img) return;
    const dataUrl = drawCroppedSquare(img, zoom, 512);
    try {
      localStorage.setItem(storageKey, dataUrl);
      if (onSaved) onSaved();
      alert("Saved photo!");
    } catch (e) {
      alert("Could not save photo (private window or storage full).");
    }
  };

  const onClear = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setFileUrl(null);
    if (onSaved) onSaved();
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontWeight: 600 }}>Upload a photo</span>
        <input type="file" accept="image/*" capture="user" onChange={onPick} />
      </label>

      {fileUrl ? (
        <>
          <div
            style={{
              width: size,
              height: size,
              borderRadius: 16,
              background: bg,
              display: "grid",
              placeItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* The image scales with zoom; we preview roughly the center */}
            <img
              ref={imgRef}
              src={fileUrl}
              alt="to-crop"
              style={{
                maxWidth: "unset",
                width: "auto",
                height: "auto",
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
            {/* Simple square overlay frame */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.35) inset",
                border: "2px solid white",
                borderRadius: 12,
                pointerEvents: "none",
              }}
            />
          </div>

          <label style={{ display: "grid", gap: 4 }}>
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={3.5}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
          </label>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onSave} style={{ padding: "8px 12px", fontWeight: 600 }}>
              Save
            </button>
            <button onClick={onClear} style={{ padding: "8px 12px" }}>
              Clear
            </button>
          </div>
        </>
      ) : (
        <p style={{ opacity: 0.8 }}>Pick a photo and adjust zoom. We auto-center and crop to a square.</p>
      )}
    </div>
  );
}
