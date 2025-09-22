import { Routes, Route } from "react-router-dom";
 copilot/fix-dfc30e43-419b-412a-a888-d4c55c540c46

// Simple test components
function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Hoop Dreams</h1>
      <p>Basketball Life Simulator</p>
      <nav>
        <a href="/play" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>Play Game</a>
        <a href="/customize-new" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>Customize Avatar</a>
      </nav>
    </div>
  );
}

function Play() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Play Game</h1>
      <p>This is where the game would start.</p>
      <a href="/" style={{ color: 'blue' }}>← Back to Home</a>
    </div>
  );
}

function CustomizeNew() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Customize Avatar</h1>
      <p>Avatar customization page would go here.</p>
      <a href="/" style={{ color: 'blue' }}>← Back to Home</a>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: 'blue' }}>← Back to Home</a>
    </div>
  );
}

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/customize-new" element={<CustomizeNew />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
=======
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Home from "@/pages/Home";
import Play from "@/pages/Play";
import AvatarCustomizeNew from "@/pages/AvatarCustomizeNew";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/customize-new" element={<AvatarCustomizeNew />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
 main
  );
}

export default App;