import React from "react";
import PhotoAvatar from "@/avatar/PhotoAvatar";
import AvatarOrPhoto from "@/components/AvatarOrPhoto";
import { Link } from "wouter";

interface AvatarPhotoPageProps {
  onNavigate?: (path: string) => void;
}

export default function AvatarPhotoPage({ onNavigate }: AvatarPhotoPageProps) {
  const [, force] = React.useReducer((x) => x + 1, 0);
  return (
    <div style={{ padding: 24, display: "grid", gap: 16 }}>
      <h2>Set Your Photo</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <AvatarOrPhoto size={112} />
        <div>
          <div style={{ fontWeight: 600 }}>Current</div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Silhouette shows until you save a photo.</div>
        </div>
      </div>
      <PhotoAvatar onSaved={() => force()} />
      <div style={{ marginTop: 8 }}>
        <Link to="/" style={{ color: "royalblue" }}>← Back to Main Menu</Link>
      </div>
    </div>
  );
}