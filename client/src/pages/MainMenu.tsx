import React from "react";
import { Link } from "@/lib/router";
import "@/styles/global.css";
export default function MainMenu(){
  return (
    <div className="court-bg">
      <div className="menu-panel">
        <h1 className="menu-title">Hoop Dreams</h1>
        <div className="menu-sub">Basketball Life Simulator</div>
        <div className="menu-list">
          <Link to="/play" className="btn">▶ Play</Link>
          <Link to="/load" className="btn secondary">↺ Load / Continue</Link>
          <Link to="/roster" className="btn secondary">👥 Roster Editor</Link>
          <Link to="/settings" className="btn secondary">⚙ Settings</Link>
        </div>
        <div style={{height:"24px"}} />
        <div style={{opacity:.7}}>Version 0.2</div>
      </div>
    </div>
  );
}
