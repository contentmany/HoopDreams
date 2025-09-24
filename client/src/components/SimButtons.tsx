import React from "react";
import { simTick } from "@/lib/store";
export default function SimButtons(){
  return (
    <div style={{display:"flex",gap:8}}>
      <button className="btn secondary" onClick={()=>simTick("week")}>⏩ 1W</button>
      <button className="btn secondary" onClick={()=>simTick("month")}>⏩ 1M</button>
      <button className="btn secondary" onClick={()=>simTick("season")}>⏭ Season</button>
    </div>
  );
}
