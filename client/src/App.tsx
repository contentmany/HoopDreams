import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Play from "@/pages/Play";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";

export default function App(){
  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
