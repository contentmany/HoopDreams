import React from "react";
import { Store, useAllPlayers } from "@/lib/store";
import { Link, useNavigate } from "@/lib/router";
export default function Roster(){
  const nav=useNavigate();
  const players=useAllPlayers();
  return (
    <div className="page">
      <button className="btn ghost" onClick={()=>nav(-1)}>← Back</button>
      <h2>Roster Editor</h2>
      <Link className="btn" to="/new">+ Create Player</Link>
      <div style={{height:10}}/>
      <div className="grid2">
        {players.map(p=>(
          <div className="card" key={p.id}>
            <div style={{display:"flex",gap:10}}>
              <img src={p.avatarDataUrl||""} width={72} height={72} style={{borderRadius:10,background:"#222"}}/>
              <div>
                <div style={{fontWeight:800}}>{p.name}</div>
                <div>{p.position} • OVR {p.overall}</div>
                <div style={{opacity:.8}}>{p.team??"Free Agent"}</div>
              </div>
            </div>
            <div style={{height:8}}/>
            <button className="btn secondary" onClick={()=>{ Store.setCurrent(p.id); nav("/play"); }}>Set Active</button>
          </div>
        ))}
        {players.length===0 && <div className="card">Your roster is empty.</div>}
      </div>
    </div>
  );
}
