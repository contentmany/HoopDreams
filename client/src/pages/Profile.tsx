import React from "react";
import { Link } from "react-router-dom";
import AvatarUploader from "@/components/AvatarUploader";

export default function Profile(){
  return (
    <div style={{ padding: 24 }}>
      <h1>Profile</h1>
      <AvatarUploader />
      <p style={{ marginTop: 16 }}>
        <Link to="/">← Back home</Link>
      </p>
    </div>
  );
}
