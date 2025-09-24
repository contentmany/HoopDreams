import React from "react";
import { Link } from "react-router-dom";
import AvatarImage from "@/components/AvatarImage";

export default function Play(){
  return (
    <div style={{ padding: 24 }}>
      <h1>Play</h1>
      <p>Your avatar:</p>
      <AvatarImage size={96} />
      <p style={{ marginTop: 16, opacity: 0.75 }}>
        Game screen stub — integrate with your gameplay UI here.
      </p>
      <p>
        <Link to="/">← Back home</Link>
      </p>
    </div>
  );
}
