import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AvatarCustomizeNewProps {
  onNavigate?: (path: string) => void;
}

export default function AvatarCustomizeNew({ onNavigate }: AvatarCustomizeNewProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    onNavigate?.("/");
    navigate("/");
  };

  return (
    <div style={{ padding: 24 }}>
      <div>
        <button onClick={handleBack} style={{ marginBottom: 16 }}>
          ← Back
        </button>
        <h1>Customize Appearance</h1>
      </div>
      <div>
        <h2>Avatar Customization</h2>
        <p>This is where you would customize your pixel avatar.</p>
        <div style={{ background: '#f0f0f0', padding: 20, margin: '20px 0' }}>
          <p>Avatar preview would appear here</p>
        </div>
        <div>
          <label>
            Hair Style:
            <select style={{ marginLeft: 8 }}>
              <option>Buzz Cut</option>
              <option>Waves</option>
              <option>Braids</option>
            </select>
          </label>
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={handleBack}>Save & Return</button>
        </div>
      </div>
    </div>
  );
}