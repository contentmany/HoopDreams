import React from "react";
import BottomNav from "@/components/BottomNav";
export default function Settings(){
  return (
    <div style={{minHeight:"100vh",display:"grid",gridTemplateRows:"auto 1fr auto"}}>
      <header className="header"><strong>Settings</strong></header>
      <div className="page"><div className="grid2">
        <div className="card"><h3>Audio</h3><p>(Mock)</p></div>
        <div className="card"><h3>Graphics</h3><p>(Mock)</p></div>
      </div></div><BottomNav/>
    </div>
  );
}
