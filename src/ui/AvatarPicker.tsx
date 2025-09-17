import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderAvatar } from "../avatar/render";
import { AvatarState } from "../avatar/types";
import { HAIR, ACCESSORIES } from "../avatar/assets";
import {
  saveAvatarState,
  loadAvatarState,
  clearAvatarState,
  exportAvatarJSON,
  exportAvatarPNG,
  DEFAULT_AVATAR_KEY,
} from "../lib/storage/avatarStorage";

// Debounce helper
function useDebouncedEffect(fn: () => void, deps: any[], delay = 250) {
  useEffect(() => {
    const t = setTimeout(fn, delay);
    return () => clearTimeout(t);
  }, deps);
}

const DEFAULT_STATE: AvatarState = {
  head: { x: 70, y: 40, w: 220, h: 260, tilt: 0 },
  hairId: "hair_afro",
  accessories: [],
};

export default function AvatarPicker({ storageKey = DEFAULT_AVATAR_KEY }: { storageKey?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load once from storage (fallback to defaults)
  const initial = useMemo<AvatarState>(
    () => loadAvatarState<AvatarState>(storageKey) ?? DEFAULT_STATE,
    [storageKey],
  );
  const [state, setState] = useState<AvatarState>(initial);

  // Render preview
  useEffect(() => {
    if (canvasRef.current) renderAvatar(canvasRef.current, state);
  }, [state]);

  // Auto-save (debounced)
  useDebouncedEffect(() => {
    saveAvatarState<AvatarState>(state, storageKey);
  }, [state, storageKey], 250);

  // Actions
  async function handleExportPNG() {
    if (!canvasRef.current) return;
    const blob = await exportAvatarPNG(canvasRef.current);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "avatar.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportJSON() {
    const json = exportAvatarJSON(state);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "avatar.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    clearAvatarState(storageKey);
    setState(DEFAULT_STATE);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
      <div>
        <canvas
          ref={canvasRef}
          width={360}
          height={420}
          style={{ border: "1px solid #ddd", borderRadius: 8 }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={handleExportPNG}>Export PNG</button>
          <button onClick={handleExportJSON}>Export JSON</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div>
        <h3>Hair</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {HAIR.map((h) => (
            <button
              key={h.id}
              onClick={() => setState((s) => ({ ...s, hairId: h.id }))}
              style={{
                padding: 8,
                borderRadius: 8,
                border: state.hairId === h.id ? "2px solid #111" : "1px solid #ccc",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {h.id.replace("hair_", "")}
            </button>
          ))}
        </div>

        <h3 style={{ marginTop: 16 }}>Accessories</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {ACCESSORIES.map((a) => {
            const on = state.accessories.includes(a.id);
            return (
              <button
                key={a.id}
                onClick={() =>
                  setState((s) => {
                    const set = new Set(s.accessories);
                    on ? set.delete(a.id) : set.add(a.id);
                    return { ...s, accessories: [...set] };
                  })
                }
                style={{
                  padding: 8,
                  borderRadius: 8,
                  border: on ? "2px solid #111" : "1px solid #ccc",
                  background: "#fff",
                }}
              >
                {a.id}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
