import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import RouteGuard from "@/components/RouteGuard";
import { activeSlot, player as playerStorage } from "@/utils/localStorage";

// Layouts
import PreGameLayout from "@/layouts/PreGameLayout";
import GameLayout from "@/layouts/GameLayout";

// Game Pages
import MainMenu from "@/pages/MainMenu";
import Dashboard from "@/pages/Dashboard";
import CreatePlayer from "@/pages/CreatePlayer";
import PlayerBuilder from "@/pages/PlayerBuilder";
import LoadSave from "@/pages/LoadSave";
import Settings from "@/pages/Settings";
import League from "@/pages/League";
import Badges from "@/pages/Badges";
import Dash from "@/pages/Dash";
import News from "@/pages/News";
import Customize from "@/pages/Customize";

function Router() {
  const [, setLocation] = useLocation();

  const handleNavigate = (path: string) => {
    setLocation(path);
  };

  return (
    <Switch>
      <Route path="/">
        <PreGameLayout showHeader={false}>
          <MainMenu onNavigate={handleNavigate} />
        </PreGameLayout>
      </Route>
      <Route path="/home">
        {() => {
          const player = playerStorage.get();
          return (
            <RouteGuard requireActiveSave>
              <GameLayout 
                year={player?.seasonData?.currentYear}
                week={player?.seasonData?.currentWeek}
                maxWeeks={20}
                showAdvanceWeek={true}
              >
                <Dashboard onNavigate={handleNavigate} />
              </GameLayout>
            </RouteGuard>
          );
        }}
      </Route>
      <Route path="/new">
        <PreGameLayout title="Create Player">
          <CreatePlayer 
            onCreatePlayer={(data) => {
              console.log('Player created:', data);
              setLocation('/builder');
            }}
            onNavigate={handleNavigate}
          />
        </PreGameLayout>
      </Route>
      
      <Route path="/customize">
        <Customize onNavigate={handleNavigate} />
      </Route>
      <Route path="/builder">
        <PreGameLayout title="Player Builder">
          <PlayerBuilder onSaveBuild={() => setLocation('/home')} />
        </PreGameLayout>
      </Route>
      <Route path="/load">
        <PreGameLayout title="Load Game">
          <LoadSave 
            onLoadSlot={(id) => {
              console.log('Loading slot:', id);
              setLocation('/home');
            }}
            onNewGame={() => setLocation('/new')}
            onDeleteSlot={(id) => console.log('Delete slot:', id)}
          />
        </PreGameLayout>
      </Route>
      <Route path="/settings">
        {() => {
          const currentSlot = activeSlot.get();
          const noSaveMode = currentSlot === null;
          
          if (noSaveMode) {
            return (
              <PreGameLayout title="Settings">
                <Settings 
                  onNavigateToLoad={() => setLocation('/load')}
                  onResetGame={() => setLocation('/')}
                  noSaveMode={noSaveMode}
                />
              </PreGameLayout>
            );
          } else {
            return (
              <GameLayout>
                <Settings 
                  onNavigateToLoad={() => setLocation('/load')}
                  onResetGame={() => setLocation('/')}
                  noSaveMode={noSaveMode}
                />
              </GameLayout>
            );
          }
        }}
      </Route>
      <Route path="/league">
        {() => {
          const urlParams = new URLSearchParams(window.location.search);
          const tab = urlParams.get('tab') || 'standings';
          return (
            <RouteGuard requireActiveSave>
              <GameLayout>
                <League defaultTab={tab} />
              </GameLayout>
            </RouteGuard>
          );
        }}
      </Route>
      <Route path="/badges">
        <Badges />
      </Route>
      
      {/* Protected routes - require active save */}
      <Route path="/team">
        <RouteGuard requireActiveSave>
          <GameLayout>
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <h1 className="text-2xl font-pixel mb-4">Team</h1>
                <p className="text-muted-foreground">Coming Soon</p>
              </div>
            </div>
          </GameLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/social">
        <RouteGuard requireActiveSave>
          <GameLayout>
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <h1 className="text-2xl font-pixel mb-4">Social</h1>
                <p className="text-muted-foreground">Coming Soon</p>
              </div>
            </div>
          </GameLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/inbox">
        <RouteGuard requireActiveSave>
          <GameLayout>
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <h1 className="text-2xl font-pixel mb-4">Inbox</h1>
                <p className="text-muted-foreground">Coming Soon</p>
              </div>
            </div>
          </GameLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/news">
        <RouteGuard requireActiveSave>
          <GameLayout>
            <News onNavigate={handleNavigate} />
          </GameLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/dash">
        <RouteGuard requireActiveSave>
          <GameLayout>
            <Dash onNavigate={handleNavigate} />
          </GameLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/roster-editor">
        <PreGameLayout title="Roster Editor">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <h1 className="text-2xl font-pixel mb-4">Roster Editor</h1>
              <p className="text-muted-foreground">Coming Soon</p>
            </div>
          </div>
        </PreGameLayout>
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