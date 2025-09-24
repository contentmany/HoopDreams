import React from "react";
import { Link } from "react-router-dom";
import AvatarImage from "@/components/AvatarImage";

export default function Home(){
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <AvatarImage size={72} />
        <div>
          <h1 style={{ margin: "0 0 4px" }}>Hoop Dreams</h1>
          <div style={{ opacity: 0.75 }}>Basketball Life Simulator</div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <p>
          <Link to="/play">Play</Link>
        </p>
        <p>
          <Link to="/profile">Profile (Upload Photo)</Link>
        </p>
      </div>
    </div>
  );
}
