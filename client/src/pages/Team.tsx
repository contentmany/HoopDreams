import React from "react";
import BottomNav from "@/components/BottomNav";
export default function Team(){
  return (
    <div style={{minHeight:"100vh",display:"grid",gridTemplateRows:"auto 1fr auto"}}>
      <header className="header"><strong>Team</strong></header>
      <div className="page"><div className="card"><h3>Roster</h3><p>(Mock)</p></div></div>
      <BottomNav/>
    </div>
  );
}
