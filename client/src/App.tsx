import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Game Pages
import MainMenu from "@/pages/MainMenu";
import Dashboard from "@/pages/Dashboard";
import CreatePlayer from "@/pages/CreatePlayer";
import LoadSave from "@/pages/LoadSave";
import Settings from "@/pages/Settings";
import League from "@/pages/League";

function Router() {
  const [, setLocation] = useLocation();

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  return (
    <Switch>
      <Route path="/">
        <MainMenu onNavigate={handleNavigate} />
      </Route>
      <Route path="/home">
        <Dashboard onNavigate={handleNavigate} />
      </Route>
      <Route path="/new">
        <CreatePlayer onCreatePlayer={(data) => {
          console.log('Player created:', data);
          setLocation('/home');
        }} />
      </Route>
      <Route path="/load">
        <LoadSave 
          onLoadSlot={(id) => {
            console.log('Loading slot:', id);
            setLocation('/home');
          }}
          onNewGame={() => setLocation('/new')}
          onDeleteSlot={(id) => console.log('Delete slot:', id)}
        />
      </Route>
      <Route path="/settings">
        <Settings 
          onNavigateToLoad={() => setLocation('/load')}
          onResetGame={() => setLocation('/')}
        />
      </Route>
      <Route path="/league">
        {(params) => {
          const urlParams = new URLSearchParams(window.location.search);
          const tab = urlParams.get('tab') || 'standings';
          return <League defaultTab={tab} />;
        }}
      </Route>
      
      {/* Placeholder routes - todo: implement these pages */}
      <Route path="/team">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-pixel mb-4">Team</h1>
            <p className="text-muted-foreground">Coming Soon</p>
          </div>
        </div>
      </Route>
      
      <Route path="/social">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-pixel mb-4">Social</h1>
            <p className="text-muted-foreground">Coming Soon</p>
          </div>
        </div>
      </Route>
      
      <Route path="/inbox">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-pixel mb-4">Inbox</h1>
            <p className="text-muted-foreground">Coming Soon</p>
          </div>
        </div>
      </Route>
      
      <Route path="/roster-editor">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-pixel mb-4">Roster Editor</h1>
            <p className="text-muted-foreground">Coming Soon</p>
          </div>
        </div>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;