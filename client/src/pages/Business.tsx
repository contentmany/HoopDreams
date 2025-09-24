import React from "react";
import BottomNav from "@/components/BottomNav";
import { useCurrentPlayer } from "@/lib/store";
export default function Business(){
  const p=useCurrentPlayer();
  const income=(p?.businesses??[]).reduce((a,b)=>a+b.incomePerWeek,0);
  return (
    <div style={{minHeight:"100vh",display:"grid",gridTemplateRows:"auto 1fr auto"}}>
      <header className="header"><strong>Business</strong></header>
      <div className="page"><div className="grid2">
        <div className="card"><h3>Ventures</h3>
          {(p?.businesses??[]).map(b=>(<div key={b.name} style={{display:"flex",justifyContent:"space-between"}}><span>{b.name}</span><span>+${b.incomePerWeek}/wk</span></div>))}
          {(!p||p.businesses?.length===0)&&<p>No ventures yet.</p>}
        </div>
        <div className="card"><h3>Projected Weekly Income</h3><p style={{fontSize:"1.4rem"}}>${income}</p></div>
      </div></div><BottomNav/>
    </div>
  );
}
