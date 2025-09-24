import React from "react";
import PhotoAvatar from "@/avatar/PhotoAvatar";
import AvatarOrPhoto from "@/components/AvatarOrPhoto";
import { useLocation } from "wouter";

export default function AvatarPhotoPage() {
  const [, setLocation] = useLocation();
  const [, force] = React.useReducer((x) => x + 1, 0);
  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h2 className="text-xl font-semibold">Set Your Photo</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <AvatarOrPhoto size={112} />
        <div>
          <div style={{ fontWeight: 600 }}>Current</div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Silhouette shows until you save a photo.</div>
        </div>
      </div>
      <PhotoAvatar onSaved={() => force()} />
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => setLocation("/")}
          style={{ color: "royalblue", textDecoration: "underline" }}
        >
          ← Back to Main Menu
        </button>
      </div>
    </div>
  );
}
