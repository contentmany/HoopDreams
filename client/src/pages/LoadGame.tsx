import React from "react";
import { Store, useAllPlayers } from "@/lib/store";
import { useNavigate } from "@/lib/router";
export default function LoadGame(){
  const nav=useNavigate();
  const players=useAllPlayers();
  return (
    <div className="page">
      <button className="btn ghost" onClick={()=>nav(-1)}>← Back</button>
      <h2>Load / Continue</h2>
      <div className="grid2">
        {players.map(p=>(
          <div className="card" key={p.id}>
            <div style={{display:"flex",gap:12}}>
              <img src={p.avatarDataUrl||""} width={84} height={84} style={{borderRadius:12,background:"#222"}}/>
              <div><div style={{fontWeight:800}}>{p.name}</div><div>{p.position} • OVR {p.overall}</div><div style={{opacity:.8}}>{p.team??"Free Agent"}</div></div>
            </div>
            <div style={{height:8}}/>
            <button className="btn" onClick={()=>{Store.setCurrent(p.id); nav("/play");}}>Continue</button>
            <div style={{height:6}}/>
            <button className="btn secondary" onClick={()=>Store.remove(p.id)}>Delete</button>
          </div>
        ))}
        {players.length===0 && <div className="card">No saves yet.</div>}
      </div>
    </div>
  );
}
