import React from "react";
import { useCurrentPlayer } from "@/lib/store";
import StatsStrip from "@/components/StatsStrip";
import SimButtons from "@/components/SimButtons";
import BottomNav from "@/components/BottomNav";
export default function Play(){
  const p=useCurrentPlayer();
  return (
    <div style={{minHeight:"100vh",display:"grid",gridTemplateRows:"auto auto 1fr auto"}}>
      <header className="header">
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <a className="btn secondary" href="/">← Menu</a>
          <strong>Hoop Dreams</strong>
        </div>
        <SimButtons/>
      </header>
      <div className="page">
        <StatsStrip/>
        <div className="grid2" style={{marginTop:12}}>
          <div className="card">
            <h3>Player</h3>
            {p?(
              <div style={{display:"flex",gap:12}}>
                <img src={p.avatarDataUrl||""} width={96} height={96} style={{borderRadius:12,background:"#222"}}/>
                <div><div style={{fontWeight:800}}>{p.name}</div><div>{p.position} • OVR {p.overall}</div><div>Team: {p.team??"Free Agent"}</div></div>
              </div>
            ):<div>Load or create a player to begin.</div>}
          </div>
          <div className="card">
            <h3>News</h3>
            <ul style={{margin:0,paddingLeft:"1.2rem"}}>
              <li>Coach: “Minutes are earned.”</li>
              <li>Analysts predict tight playoff race.</li>
              <li>New endorsement rumors swirl.</li>
            </ul>
          </div>
        </div>
      </div>
      <BottomNav/>
    </div>
  );
}
