import React from "react";
import BottomNav from "@/components/BottomNav";
export default function Social(){
  return (
    <div style={{minHeight:"100vh",display:"grid",gridTemplateRows:"auto 1fr auto"}}>
      <header className="header"><strong>Social</strong></header>
      <div className="page"><div className="grid2">
        <div className="card"><h3>Feed</h3><p>“Blessed to hoop another day.”</p></div>
        <div className="card"><h3>DMs</h3><p>Agent: “Brand meeting Tues.”</p></div>
      </div></div><BottomNav/>
    </div>
  );
}
