import React from "react";
import { useCurrentPlayer } from "@/lib/store";
export default function StatsStrip(){
  const p=useCurrentPlayer();
  return (
    <div className="stats">
      {p? (<>
        <span>OVR {p.overall}</span>
        <span>ENG {p.energy}%</span>
        <span>REP {p.reputation}</span>
        <span>${p.cash.toLocaleString()}</span>
        {p.team && <span>{p.team}</span>}
      </>) : <span>No player loaded.</span>}
    </div>
  );
}
