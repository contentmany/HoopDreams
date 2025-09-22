import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Simple NotFound component
function NotFound() {
  return (
    <div style={{padding:24}}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

// Simple placeholder components for now
function AvatarCustomizeNew() {
  return (
    <div style={{padding:24}}>
      <h2>Avatar Customization</h2>
      <p>Avatar customization feature coming soon!</p>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

function Play() {
  return (
    <div style={{padding:24}}>
      <h2>Play Game</h2>
      <p>Game interface coming soon!</p>
      <Link to="/">← Back to Home</Link>
    </div>
  );
}

function Home() {
  return (
    <div style={{padding:24}}>
      <h1>HoopDreams</h1>
      <p>New pixel avatars are wired. Go customize:</p>
      <p><Link to="/customize-new">Customize Appearance (Pixel)</Link></p>
      <p><Link to="/play">Play</Link></p>
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/customize-new" element={<AvatarCustomizeNew/>} />
        <Route path="/play" element={<Play/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}
