import React, { useState } from "react";
import { Player, Store } from "@/lib/store";
import PhotoAvatar from "@/components/PhotoAvatar";
import { useNavigate } from "@/lib/router";
export default function NewPlayer(){
  const nav=useNavigate();
  const [name,setName]=useState(""); const [pos,setPos]=useState<"PG"|"SG"|"SF"|"PF"|"C">("PG");
  const [avatar,setAvatar]=useState<string|null>(null);
  function create(){
    const p: Player = {
      id:`p_${Date.now()}`, name: name || "Rookie", position:pos,
      overall:62, cash:1500, energy:100, reputation:12, team:"Free Agent",
      avatarDataUrl: avatar || undefined,
      businesses:[{name:"Pop-up Clinic", incomePerWeek:120},{name:"Skill Camp", incomePerWeek:180}]
    };
    Store.upsert(p); nav("/play");
  }
  return (
    <div className="page">
      <button className="btn ghost" onClick={()=>nav(-1)}>← Back</button>
      <h2>Create Player</h2>
      <div className="grid2">
        <div className="card">
          <label>Name<br/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>
          <div style={{height:8}}/>
          <label>Position<br/>
            <select value={pos} onChange={e=>setPos(e.target.value as any)}>
              {["PG","SG","SF","PF","C"].map(x=><option key={x} value={x}>{x}</option>)}
            </select>
          </label>
        </div>
        <div className="card center"><PhotoAvatar value={avatar||undefined} onChange={setAvatar}/></div>
      </div>
      <div style={{height:12}}/>
      <button className="btn" onClick={create}>Create & Start</button>
    </div>
  );
}
