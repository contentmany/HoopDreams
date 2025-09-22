import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AvatarCustomizeNew from "@/pages/AvatarCustomizeNew";
import NotFound from "@/pages/not-found";

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>HoopDreams</h1>
      <p>New pixel avatars are wired. Go customize:</p>
      <p>
        <Link to="/customize-new">Customize Appearance (Pixel)</Link>
      </p>
      <p>
        <Link to="/play">Play</Link>
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/customize-new" element={<AvatarCustomizeNew />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}