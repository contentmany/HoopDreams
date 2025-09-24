import { useState, useEffect } from "react";
import AvatarImage from "@/features/avatar/AvatarImage";
import GameHeader from "@/components/GameHeader";
import GameCard from "@/components/GameCard";
import QuickActions from "@/components/QuickActions";
import LeagueSnapshot from "@/components/LeagueSnapshot";
import StatsStrip from "@/components/StatsStrip";
import SimControls from "@/components/SimControls";
import BottomTabBar from "@/components/BottomTabBar";
import GameResultsModal from "@/components/GameResultsModal";
import { player as playerStorage, saveSlots, activeSlot } from "@/utils/localStorage";
import { loadSave, saveSave, newSeason, advanceWeek, playCurrentGame, getNextGame, simToEndOfSeason, type SaveState } from "@/state/sim";
import { useSave } from "@/hooks/useSave";
import { useToast } from "@/hooks/use-toast";
import { TEAMS } from "@/data/teams";
import type { Player } from "@/utils/localStorage";

interface DashboardProps {
  onNavigate?: (path: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const saveState = useSave(); // Use the reactive hook
  const { toast } = useToast();
  // Photo avatar handled by AvatarImage; fallback to silhouette
  const [gameResultsModal, setGameResultsModal] = useState<{
    isOpen: boolean;
    result?: any;
    opponent?: any;
    location?: 'Home' | 'Away';
  }>({ isOpen: false });

  useEffect(() => {
    const player = playerStorage.get();
    if (player) {
      setCurrentPlayer(player);
      
      // Initialize SaveState if needed (useSave hook handles the state)
      const currentSave = loadSave();
      if (!currentSave || !currentSave.player) {
        // Initialize new save state from player data
        const initialSeason = newSeason(2025, player.teamId || 'cvhs', 'northern');
        const initialSaveState: SaveState = {
          year: 2025,
          week: 1,
          age: 16,
          birthdayWeek: 10,
          playerTeamId: player.teamId || 'cvhs',
          season: initialSeason,
          awards: [],
          history: [{ label: 'Started high school career', dateISO: new Date().toISOString() }],
          accessories: [],
          player: {
            firstName: player.nameFirst || 'Your',
            lastName: player.nameLast || 'Player',
            position: player.position || 'PG',
            archetype: 'Playmaker',
            heightInCm: player.heightCm || 180,
            baseAttributes: {
              shooting: 70,
              finishing: 65,
              defense: 60,
              rebounding: 55,
              physicals: 75
            }
          }
        };
        saveSave(initialSaveState);
      }
    }
  }, []);

  const refreshData = () => {
    // Data refreshes automatically via useSave hook
  };

  const getTeamName = (teamId: string): string => {
    const teamNames = {
      '1': 'Central High Tigers',
      '2': 'Westside Prep Eagles', 
      '3': 'Riverside Academy Lions',
      '4': 'Oak Valley Panthers',
      '5': 'Pine Ridge Wolves',
      '6': 'Mountain View Hawks',
      '7': 'Valley Tech Rams',
      '8': 'East Side Bears'
    };
    return teamNames[teamId as keyof typeof teamNames] || 'Your Team';
  };

  const handlePlayGame = () => {
    const currentSave = loadSave();
    const currentGame = getNextGame(currentSave);
    
    if (!currentGame) {
      // Handle end of season case
      if (currentSave.week > 20) {
        const completedSave = simToEndOfSeason(currentSave);
        toast({
          title: "Season completed",
          description: "New season started."
        });
        return;
      }
      return;
    }
    
    const opponent = TEAMS[currentGame.opponentId];
    if (!opponent) return;
    
    // Use unified engine
    const updatedSave = playCurrentGame(currentSave);
    
    // Get the result for the modal
    const result = updatedSave.season.results.find(r => r.week === currentGame.week);
    if (result) {
      // Format result data for GameResultsModal
      const playerScore = result.won ? 95 : 88;
      const opponentScore = result.won ? 88 : 95;
      
      // Show results modal with expected format
      setGameResultsModal({
        isOpen: true,
        result: {
          playerStats: {
            points: result.points,
            rebounds: result.rebounds,
            assists: result.assists
          },
          teamStats: {
            win: result.won,
            playerScore,
            opponentScore
          },
          gameGrade: result.points >= 20 ? 'A' : result.points >= 15 ? 'B' : 'C',
          energyUsed: 3,
          injuryRisk: false
        },
        opponent: {
          name: opponent.name,
          abbrev: opponent.abbrev
        },
        location: result.home ? 'Home' : 'Away'
      });
      
      toast({
        title: result.won ? "Victory!" : "Defeat",
        description: `${result.points} PTS, ${result.rebounds} REB, ${result.assists} AST`
      });
    }
  };

  // These are now handled by SimControls component

  const handleScouting = () => {
    console.log('Scouting functionality coming soon!');
  };

  if (!currentPlayer || !saveState) {
    return (
      <div className="min-h-screen bg-background">
        <GameHeader />
        <main className="px-4 pt-4 pb-32 flex items-center justify-center">
          <p className="text-muted-foreground">Loading player data...</p>
        </main>
        <BottomTabBar />
      </div>
    );
  }

  // Convert standings to display format
  const standings = Object.entries(saveState.season.standings).map(([teamId, record]) => ({
    name: TEAMS[teamId]?.name || teamId,
    wins: record.w,
    losses: record.l,
    streak: record.w > record.l ? `W${record.w}` : `L${record.l}`,
    color: teamId === saveState.playerTeamId ? "#7A5BFF" : "#38E1C6"
  }));

  const schedule = saveState.season.schedule.slice(saveState.week, saveState.week + 3).map((game, index) => ({
    homeTeam: game.home ? TEAMS[saveState.playerTeamId]?.name || 'You' : TEAMS[game.opponentId]?.name || 'TBD',
    awayTeam: game.home ? TEAMS[game.opponentId]?.name || 'TBD' : TEAMS[saveState.playerTeamId]?.name || 'You',
    week: game.week
  }));

  const stats = [
    { label: "Energy", current: currentPlayer.energy || 8, max: 10 },
    { label: "Mood", current: currentPlayer.mood || 7, max: 10 },
    { label: "Clout", current: currentPlayer.clout || 5, max: 100 },
    { label: "Chemistry", current: currentPlayer.chemistry || 65, max: 100 },
    { label: "Health", current: currentPlayer.health || 100, max: 100 },
    { label: "Reputation", current: currentPlayer.reputation || 0, max: 100 },
  ];

  return (
    <>
      <main className="space-y-6">
        {/* Player Info Card */}
        <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
          <AvatarImage size={64} />
          <div className="flex-1">
            <button 
              onClick={() => onNavigate?.('/profile')}
              className="font-semibold text-left hover:text-primary transition-colors"
              data-testid="button-player-name"
            >
              {currentPlayer.nameFirst} {currentPlayer.nameLast}
            </button>
            <p className="text-sm text-muted-foreground">{currentPlayer.position} • {getTeamName(currentPlayer.teamId)}</p>
          </div>
        </div>

        {/* New Simulation Controls */}
        <SimControls 
          currentSave={saveState}
          onSimComplete={refreshData}
        />

        {(() => {
          const nextGame = getNextGame(saveState);
          if (nextGame) {
            return (
              <GameCard 
                opponentId={nextGame.opponentId}
                gameType="Regular Season"
                location={nextGame.home ? 'Home' : 'Away'}
                energyCost={3}
                onPlayGame={handlePlayGame}
                onScouting={handleScouting}
              />
            );
          } else if (saveState.week > 20) {
            return (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Regular Season Complete!</h3>
                <p className="text-muted-foreground">
                  No remaining regular-season games.
                </p>
              </div>
            );
          }
          return null;
        })()}
        
        
        <QuickActions onAction={(path) => onNavigate?.(path)} />
        
        {saveState && standings.length > 0 && (
          <LeagueSnapshot 
            standings={standings}
            schedule={schedule}
            onViewFull={(tab) => onNavigate?.(`/league?tab=${tab}`)}
          />
        )}
      </main>

      {gameResultsModal.result && gameResultsModal.opponent && (
        <GameResultsModal
          isOpen={gameResultsModal.isOpen}
          onClose={() => setGameResultsModal({ isOpen: false })}
          gameResult={gameResultsModal.result}
          opponent={gameResultsModal.opponent}
          location={gameResultsModal.location!}
        />
      )}
    </>
  );
}