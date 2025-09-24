import React from "react";
import { Routes, Route, Navigate } from "@/lib/router";
import MainMenu from "@/pages/MainMenu";
import NewPlayer from "@/pages/NewPlayer";
import LoadGame from "@/pages/LoadGame";
import Roster from "@/pages/Roster";
import Play from "@/pages/Play";
import League from "@/pages/League";
import Team from "@/pages/Team";
import Social from "@/pages/Social";
import Business from "@/pages/Business";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { Store } from "@/lib/store";

function GuardedPlay(){
  // Require an active player to enter the game
  const p = Store.current();
  return p ? <Play/> : <Navigate to="/new" replace />;
}

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<MainMenu/>}/>
      <Route path="/new" element={<NewPlayer/>}/>
      <Route path="/load" element={<LoadGame/>}/>
      <Route path="/roster" element={<Roster/>}/>
      <Route path="/play" element={<GuardedPlay/>}/>
      <Route path="/league" element={<League/>}/>
      <Route path="/team" element={<Team/>}/>
      <Route path="/social" element={<Social/>}/>
      <Route path="/business" element={<Business/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  );
}
