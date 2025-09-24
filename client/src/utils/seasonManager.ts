import type { Player } from './localStorage';
import { settings, player as playerStorage, saveSlots, activeSlot } from './localStorage';
import { generateOpponentTeam, type OpponentTeam, type GameResult } from './gameSimulation';

export interface SeasonData {
  currentWeek: number;
  currentYear: number;
  seasonGames: GameHistory[];
  teamRecord: { wins: number; losses: number };
  upcomingGame?: {
    opponent: OpponentTeam;
    gameType: 'Regular Season' | 'Conference' | 'Playoffs' | 'Championship';
    location: 'Home' | 'Away';
  };
  seasonStats: {
    gamesPlayed: number;
    avgPoints: number;
    avgRebounds: number;
    avgAssists: number;
    avgSteals: number;
    avgBlocks: number;
    fgPct: number;
    threePct: number;
    ftPct: number;
  };
  standings: TeamStanding[];
  isSeasonComplete: boolean;
  awards?: SeasonAward[];
}

export interface GameHistory {
  week: number;
  opponent: string;
  playerScore: number;
  opponentScore: number;
  win: boolean;
  playerStats: GameResult['playerStats'];
  gameGrade: GameResult['gameGrade'];
  location: 'Home' | 'Away';
  gameType: 'Regular Season' | 'Conference' | 'Playoffs' | 'Championship';
}

export interface TeamStanding {
  name: string;
  wins: number;
  losses: number;
  winPct: number;
  streak: string;
  isPlayerTeam?: boolean;
}

export interface SeasonAward {
  type: 'MVP' | 'All-Star' | 'Rookie of the Year' | 'Tournament MVP' | 'Championship';
  description: string;
  achieved: boolean;
}

// Initialize season data for a new player
export const initializeSeason = (player: Player): SeasonData => {
  const currentSettings = settings.get();
  const totalGames = currentSettings.seasonLength === 'standard' ? 20 : 14;
  
  return {
    currentWeek: 1,
    currentYear: 2026,
    seasonGames: [],
    teamRecord: { wins: 0, losses: 0 },
    upcomingGame: {
      opponent: generateOpponentTeam(1, currentSettings.difficulty === 'Custom' ? 'Normal' : currentSettings.difficulty),
      gameType: 'Regular Season',
      location: Math.random() > 0.5 ? 'Home' : 'Away'
    },
    seasonStats: {
      gamesPlayed: 0,
      avgPoints: 0,
      avgRebounds: 0,
      avgAssists: 0,
      avgSteals: 0,
      avgBlocks: 0,
      fgPct: 0,
      threePct: 0,
      ftPct: 0
    },
    standings: generateInitialStandings(player.teamName || 'Your Team'),
    isSeasonComplete: false
  };
};

// Generate initial league standings
const generateInitialStandings = (playerTeamName: string): TeamStanding[] => {
  const teams = [
    'Central Valley High', 'Riverside Academy', 'Oak Hills Prep', 'Westside Warriors',
    'Mountain View Lions', 'Pine Ridge Eagles', 'Lakewood Rams', 'Sunset Panthers',
    'Northside Titans', 'Eastwood Falcons'
  ];
  
  // Remove player team from the list and add it
  const otherTeams = teams.filter(team => team !== playerTeamName);
  const allTeams = [playerTeamName, ...otherTeams.slice(0, 9)]; // Total of 10 teams
  
  return allTeams.map((name, index) => ({
    name,
    wins: 0,
    losses: 0,
    winPct: 0.000,
    streak: '-',
    isPlayerTeam: name === playerTeamName
  }));
};

// Update season data after a game
export const updateSeasonAfterGame = (
  seasonData: SeasonData, 
  gameResult: GameResult,
  opponent: OpponentTeam,
  location: 'Home' | 'Away'
): SeasonData => {
  const currentSettings = settings.get();
  const totalGames = currentSettings.seasonLength === 'standard' ? 20 : 14;
  
  // Add game to history
  const gameHistory: GameHistory = {
    week: seasonData.currentWeek,
    opponent: opponent.name,
    playerScore: gameResult.teamStats.playerScore,
    opponentScore: gameResult.teamStats.opponentScore,
    win: gameResult.teamStats.win,
    playerStats: gameResult.playerStats,
    gameGrade: gameResult.gameGrade,
    location,
    gameType: seasonData.currentWeek > totalGames ? 'Playoffs' : 'Regular Season'
  };
  
  const newSeasonGames = [...seasonData.seasonGames, gameHistory];
  
  // Update team record
  const newRecord = {
    wins: seasonData.teamRecord.wins + (gameResult.teamStats.win ? 1 : 0),
    losses: seasonData.teamRecord.losses + (gameResult.teamStats.win ? 0 : 1)
  };
  
  // Update season stats
  const newSeasonStats = calculateSeasonStats(newSeasonGames);
  
  // Update standings
  const newStandings = updateStandings(seasonData.standings, gameResult.teamStats.win, opponent.name);
  
  // Generate next game (if season not complete)
  const isSeasonComplete = newSeasonGames.length >= totalGames;
  const upcomingGame = isSeasonComplete ? undefined : {
    opponent: generateOpponentTeam(seasonData.currentWeek + 1, currentSettings.difficulty === 'Custom' ? 'Normal' : currentSettings.difficulty),
    gameType: (seasonData.currentWeek + 1) > totalGames ? 'Playoffs' as const : 'Regular Season' as const,
    location: Math.random() > 0.5 ? 'Home' as const : 'Away' as const
  };
  
  // Check for awards (end of season)
  let awards: SeasonAward[] = [];
  if (isSeasonComplete) {
    awards = calculateSeasonAwards(newSeasonStats, newRecord, newSeasonGames);
  }
  
  return {
    ...seasonData,
    seasonGames: newSeasonGames,
    teamRecord: newRecord,
    seasonStats: newSeasonStats,
    standings: newStandings,
    upcomingGame,
    isSeasonComplete,
    awards: awards.length > 0 ? awards : undefined
  };
};

// Calculate aggregated season statistics
const calculateSeasonStats = (games: GameHistory[]) => {
  if (games.length === 0) {
    return {
      gamesPlayed: 0,
      avgPoints: 0,
      avgRebounds: 0,
      avgAssists: 0,
      avgSteals: 0,
      avgBlocks: 0,
      fgPct: 0,
      threePct: 0,
      ftPct: 0
    };
  }
  
  const totals = games.reduce((acc, game) => ({
    points: acc.points + game.playerStats.points,
    rebounds: acc.rebounds + game.playerStats.rebounds,
    assists: acc.assists + game.playerStats.assists,
    steals: acc.steals + game.playerStats.steals,
    blocks: acc.blocks + game.playerStats.blocks,
    fgm: acc.fgm + game.playerStats.fgm,
    fga: acc.fga + game.playerStats.fga,
    threePM: acc.threePM + game.playerStats.threePM,
    threePA: acc.threePA + game.playerStats.threePA,
    ftm: acc.ftm + game.playerStats.ftm,
    fta: acc.fta + game.playerStats.fta,
  }), {
    points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
    fgm: 0, fga: 0, threePM: 0, threePA: 0, ftm: 0, fta: 0
  });
  
  const gameCount = games.length;
  
  return {
    gamesPlayed: gameCount,
    avgPoints: Math.round((totals.points / gameCount) * 10) / 10,
    avgRebounds: Math.round((totals.rebounds / gameCount) * 10) / 10,
    avgAssists: Math.round((totals.assists / gameCount) * 10) / 10,
    avgSteals: Math.round((totals.steals / gameCount) * 10) / 10,
    avgBlocks: Math.round((totals.blocks / gameCount) * 10) / 10,
    fgPct: totals.fga > 0 ? Math.round((totals.fgm / totals.fga) * 1000) / 10 : 0,
    threePct: totals.threePA > 0 ? Math.round((totals.threePM / totals.threePA) * 1000) / 10 : 0,
    ftPct: totals.fta > 0 ? Math.round((totals.ftm / totals.fta) * 1000) / 10 : 0,
  };
};

// Update league standings
const updateStandings = (
  standings: TeamStanding[], 
  playerWin: boolean, 
  opponentName: string
): TeamStanding[] => {
  return standings.map(team => {
    if (team.isPlayerTeam) {
      const newWins = team.wins + (playerWin ? 1 : 0);
      const newLosses = team.losses + (playerWin ? 0 : 1);
      const winPct = (newWins + newLosses) > 0 ? newWins / (newWins + newLosses) : 0;
      
      return {
        ...team,
        wins: newWins,
        losses: newLosses,
        winPct: Math.round(winPct * 1000) / 1000,
        streak: playerWin ? `W1` : `L1` // Simplified streak
      };
    } else if (team.name === opponentName) {
      const newWins = team.wins + (playerWin ? 0 : 1);
      const newLosses = team.losses + (playerWin ? 1 : 0);
      const winPct = (newWins + newLosses) > 0 ? newWins / (newWins + newLosses) : 0;
      
      return {
        ...team,
        wins: newWins,
        losses: newLosses,
        winPct: Math.round(winPct * 1000) / 1000,
        streak: playerWin ? `L1` : `W1`
      };
    } else {
      // Simulate other teams' results
      if (Math.random() > 0.5) {
        const newWins = team.wins + 1;
        const winPct = newWins / (newWins + team.losses);
        return {
          ...team,
          wins: newWins,
          winPct: Math.round(winPct * 1000) / 1000,
        };
      } else {
        const newLosses = team.losses + 1;
        const winPct = team.wins / (team.wins + newLosses);
        return {
          ...team,
          losses: newLosses,
          winPct: Math.round(winPct * 1000) / 1000,
        };
      }
    }
  }).sort((a, b) => b.winPct - a.winPct); // Sort by win percentage
};

// Calculate season awards
const calculateSeasonAwards = (
  stats: SeasonData['seasonStats'],
  record: { wins: number; losses: number },
  games: GameHistory[]
): SeasonAward[] => {
  const awards: SeasonAward[] = [];
  const winPct = record.wins / (record.wins + record.losses);
  
  // MVP criteria: Good stats + good record
  if (stats.avgPoints >= 18 && stats.avgRebounds >= 6 && winPct >= 0.7) {
    awards.push({
      type: 'MVP',
      description: 'Most Valuable Player - Outstanding performance and team success',
      achieved: true
    });
  }
  
  // All-Star criteria: Solid stats
  if (stats.avgPoints >= 15 && (stats.avgRebounds >= 7 || stats.avgAssists >= 5)) {
    awards.push({
      type: 'All-Star',
      description: 'All-Star Team Selection - Excellent individual performance',
      achieved: true
    });
  }
  
  // Championship criteria: Perfect record or very high win rate
  if (winPct >= 0.9) {
    awards.push({
      type: 'Championship',
      description: 'Conference Championship - Dominant season performance',
      achieved: true
    });
  }
  
  return awards;
};

// Advance week (for SIM functionality)
export const advanceWeek = (player: Player): { 
  player: Player; 
  seasonData: SeasonData; 
  weekEvents: string[];
} => {
  const currentSeasonData = player.seasonData || initializeSeason(player);
  
  const weekEvents: string[] = [];
  
  // Recover some energy
  const energyRecovery = Math.min(2, 10 - (player.energy || 8));
  const newEnergy = Math.min(10, (player.energy || 8) + energyRecovery);
  
  if (energyRecovery > 0) {
    weekEvents.push(`Recovered ${energyRecovery} energy from rest`);
  }
  
  // Training opportunity (if not injured)
  let attributeBoosts: string[] = [];
  if (!player.injury && newEnergy >= 4) {
    // Random attribute training
    const trainableAttrs = ['speed', 'strength', 'vertical', 'stamina', 'ballHandle', 'passAccuracy'] as const;
    const attrToTrain = trainableAttrs[Math.floor(Math.random() * trainableAttrs.length)];
    const currentValue = player.attributes[attrToTrain];
    
    if (currentValue < 95) {
      const currentSettings = settings.get();
      const difficulty = currentSettings.difficulty;
      const trainingGain = difficulty === 'Easy' ? 1 : difficulty === 'Normal' ? Math.random() > 0.5 ? 1 : 0 : Math.random() > 0.7 ? 1 : 0;
      
      if (trainingGain > 0) {
        player.attributes[attrToTrain] = Math.min(95, currentValue + trainingGain);
        attributeBoosts.push(`${attrToTrain} improved by ${trainingGain}`);
        weekEvents.push(`Training paid off: ${attrToTrain.charAt(0).toUpperCase() + attrToTrain.slice(1)} +${trainingGain}`);
      }
    }
  }
  
  // Heal injury (if any)
  if (player.injury) {
    player.injury.weeksRemaining = Math.max(0, player.injury.weeksRemaining - 1);
    if (player.injury.weeksRemaining === 0) {
      weekEvents.push(`Recovered from ${player.injury.type} injury`);
      delete player.injury;
    } else {
      weekEvents.push(`Still recovering from ${player.injury.type} (${player.injury.weeksRemaining} weeks remaining)`);
    }
  }
  
  // Chemistry improvement
  const chemistry = Math.min(100, (player.chemistry || 65) + Math.random() * 3);
  if (chemistry > (player.chemistry || 65)) {
    weekEvents.push(`Team chemistry improved`);
  }
  
  // Mood fluctuation
  const moodChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
  const mood = Math.max(1, Math.min(10, (player.mood || 7) + moodChange));
  
  const updatedPlayer: Player = {
    ...player,
    energy: newEnergy,
    chemistry,
    mood,
    seasonData: {
      ...currentSeasonData,
      currentWeek: currentSeasonData.currentWeek + 1
    }
  };
  
  return {
    player: updatedPlayer,
    seasonData: updatedPlayer.seasonData!,
    weekEvents
  };
};