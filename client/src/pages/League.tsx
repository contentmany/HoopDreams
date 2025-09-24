import React from "react";
import BottomNav from "@/components/BottomNav";
export default function League(){
  return (
    <div style={{minHeight:"100vh",display:"grid",gridTemplateRows:"auto 1fr auto"}}>
      <header className="header"><strong>League</strong></header>
      <div className="page"><div className="grid2">
        <div className="card"><h3>Standings</h3><p>(Mock)</p></div>
        <div className="card"><h3>Schedule</h3><p>(Mock)</p></div>
      </div></div><BottomNav/>
    </div>
  );
}
