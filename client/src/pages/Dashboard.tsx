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
import { simulateGame, type GameResult, type OpponentTeam } from "@/utils/gameSimulation";
import { initializeSeason, updateSeasonAfterGame, advanceWeek, type SeasonData } from "@/utils/seasonManager";
import { loadSave, saveSave, newSeason, type SaveState } from "@/state/sim";
import { TEAMS } from "@/data/teams";
import type { Player } from "@/utils/localStorage";

interface DashboardProps {
  onNavigate?: (path: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [saveState, setSaveState] = useState<SaveState | null>(null);
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);
  // Photo avatar handled by AvatarImage; fallback to silhouette
  const [gameResultsModal, setGameResultsModal] = useState<{
    isOpen: boolean;
    result?: GameResult;
    opponent?: OpponentTeam;
    location?: 'Home' | 'Away';
  }>({ isOpen: false });

  useEffect(() => {
    const player = playerStorage.get();
    if (player) {
      setCurrentPlayer(player);
      
      // Try to load new save state first
      const newSaveState = loadSave();
      if (newSaveState) {
        setSaveState(newSaveState);
      } else {
        // Initialize new save state from old player data
        const initialSaveState: SaveState = {
          year: 2025,
          week: 1,
          age: 16,
          birthdayWeek: 10,
          playerTeamId: player.teamId || 'cvhs',
          season: newSeason(2025, player.teamId || 'cvhs', 'northern'),
          awards: [],
          history: [{ label: 'Started high school career', dateISO: new Date().toISOString() }],
          accessories: []
        };
        saveSave(initialSaveState);
        setSaveState(initialSaveState);
      }
      
      // Keep old season data for compatibility
      if (!player.seasonData) {
        const updatedPlayer = { 
          ...player, 
          teamName: getTeamName(player.teamId)
        };
        const newSeasonData = initializeSeason(updatedPlayer);
        updatedPlayer.seasonData = newSeasonData;
        playerStorage.set(updatedPlayer);
        setCurrentPlayer(updatedPlayer);
        setSeasonData(newSeasonData);
      } else {
        setSeasonData(player.seasonData);
      }
    }
  }, []);

  const refreshData = () => {
    const newSaveState = loadSave();
    setSaveState(newSaveState);
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
    if (!currentPlayer || !seasonData?.upcomingGame) return;

    const opponent = seasonData.upcomingGame.opponent;
    const location = seasonData.upcomingGame.location;
    const playerEnergy = currentPlayer.energy || 8;

    // Simulate the game
    const gameResult = simulateGame(currentPlayer, opponent, playerEnergy);
    
    // Update player stats and milestones
    const updatedMilestones = { ...currentPlayer.milestones };
    Object.entries(gameResult.milestoneUpdates).forEach(([key, value]) => {
      if (key in updatedMilestones) {
        (updatedMilestones as any)[key] = ((updatedMilestones as any)[key] || 0) + value;
      }
    });

    // Apply energy cost and potential injury
    const newEnergy = Math.max(0, playerEnergy - gameResult.energyUsed);
    const injury = gameResult.injuryRisk ? {
      type: 'Fatigue',
      weeksRemaining: 1,
      description: 'Minor fatigue from intense game'
    } : undefined;

    // Update season data
    const newSeasonData = updateSeasonAfterGame(seasonData, gameResult, opponent, location);
    
    // Update player
    const updatedPlayer: Player = {
      ...currentPlayer,
      energy: newEnergy,
      milestones: updatedMilestones,
      injury: injury || currentPlayer.injury,
      seasonData: newSeasonData,
      mood: Math.min(10, (currentPlayer.mood || 7) + (gameResult.teamStats.win ? 1 : -1)),
      chemistry: Math.min(100, (currentPlayer.chemistry || 65) + (gameResult.teamStats.win ? 2 : -1)),
      reputation: Math.min(100, (currentPlayer.reputation || 0) + Math.floor(gameResult.playerStats.points / 5))
    };

    // Save updated player
    playerStorage.set(updatedPlayer);
    setCurrentPlayer(updatedPlayer);
    setSeasonData(newSeasonData);

    // Show game results
    setGameResultsModal({
      isOpen: true,
      result: gameResult,
      opponent,
      location
    });
  };

  const handleAdvanceWeek = () => {
    if (!currentPlayer) return;

    const { player: updatedPlayer, seasonData: newSeasonData, weekEvents } = advanceWeek(currentPlayer);
    
    // Save updated player
    playerStorage.set(updatedPlayer);
    setCurrentPlayer(updatedPlayer);
    setSeasonData(newSeasonData);

    console.log('Week advanced:', weekEvents);
  };

  const handleSimWeeks = (weeks: number) => {
    if (!currentPlayer) return;

    let currentPlayerState = currentPlayer;
    
    for (let i = 0; i < weeks; i++) {
      const { player: updatedPlayer, seasonData: newSeasonData } = advanceWeek(currentPlayerState);
      currentPlayerState = updatedPlayer;
      
      // Update the season data state if this is the last iteration
      if (i === weeks - 1) {
        setSeasonData(newSeasonData);
      }
    }
    
    // Save final player state
    playerStorage.set(currentPlayerState);
    setCurrentPlayer(currentPlayerState);
    
    console.log(`Simulated ${weeks} weeks`);
  };

  const handleScouting = () => {
    console.log('Scouting functionality coming soon!');
  };

  if (!currentPlayer || !seasonData) {
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

  // Convert season data to dashboard format
  const standings = seasonData.standings.map(team => ({
    name: team.name,
    wins: team.wins,
    losses: team.losses,
    streak: team.streak,
    color: team.isPlayerTeam ? "#7A5BFF" : "#38E1C6"
  }));

  const schedule = seasonData.standings.slice(0, 3).map((team, index) => ({
    homeTeam: team.name,
    awayTeam: "TBD",
    week: seasonData.currentWeek + index
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

        {saveState && saveState.week <= 20 && saveState.season.schedule.length > 0 && (
          <GameCard 
            opponentId={saveState.season.schedule.find(g => g.week === saveState.week)?.opponentId || 'cvhs'}
            gameType="Regular Season"
            location={saveState.season.schedule.find(g => g.week === saveState.week)?.home ? 'Home' : 'Away'}
            energyCost={3}
            onPlayGame={handlePlayGame}
            onScouting={handleScouting}
          />
        )}
        
        {seasonData?.upcomingGame && !seasonData.isSeasonComplete ? (
          <GameCard 
            opponentId={seasonData.upcomingGame.opponent.name || 'cvhs'}
            gameType={seasonData.upcomingGame.gameType}
            location={seasonData.upcomingGame.location}
            energyCost={3}
            onPlayGame={handlePlayGame}
            onScouting={handleScouting}
          />
        ) : saveState && saveState.week && saveState.week > 20 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Season Complete!</h3>
            <p className="text-muted-foreground">
              Check your awards and prepare for next season.
            </p>
          </div>
        ) : null}
        
        <QuickActions onAction={(path) => onNavigate?.(path)} />
        
        {seasonData && (
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