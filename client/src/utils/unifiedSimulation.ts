// Unified simulation engine for both Play and Sim modes
import type { SaveState } from '@/state/sim';
import type { Player } from '@/utils/localStorage';
import { simulateGame, generateOpponentTeam } from '@/utils/gameSimulation';
import { TEAMS } from '@/data/teams';

export interface SimulationResult {
  statsDelta: {
    energy: number;
    chemistry: number;
    mood: number;
    reputation: number;
  };
  chemistryDelta: number;
  energyCost: number;
  result: {
    points: number;
    rebounds: number;
    assists: number;
    won: boolean;
    opponentName: string;
    playerScore: number;
    opponentScore: number;
  };
  injuries?: {
    type: string;
    weeksRemaining: number;
    description: string;
  };
  reputation?: number;
}

export function resolveGame(save: SaveState, opponentId?: string): SimulationResult {
  // Get current game opponent
  const currentGame = save.season.schedule.find(g => g.week === save.week);
  const finalOpponentId = opponentId || currentGame?.opponentId || 'default-team';
  
  // Convert SaveState to Player format for simulation
  const player: Player = {
    nameFirst: save.player.firstName,
    nameLast: save.player.lastName,
    position: save.player.position,
    archetype: save.player.archetype,
    heightInches: save.player.heightInCm / 2.54,
    heightCm: save.player.heightInCm,
    teamId: save.playerTeamId,
    look: {} as any, // Not needed for simulation
    year: save.year,
    week: save.week,
    age: save.age,
    graduationAge: save.graduationAge,
    birthdayWeek: save.birthdayWeek,
    status: save.status,
    attributes: {
      // Convert simplified attributes to detailed ones
      close: save.player.baseAttributes.finishing,
      mid: save.player.baseAttributes.shooting,
      three: save.player.baseAttributes.shooting,
      freeThrow: save.player.baseAttributes.shooting,
      drivingLayup: save.player.baseAttributes.finishing,
      drivingDunk: save.player.baseAttributes.finishing,
      postControl: save.player.baseAttributes.finishing,
      passAccuracy: save.player.baseAttributes.finishing,
      ballHandle: save.player.baseAttributes.finishing,
      speedWithBall: save.player.baseAttributes.physicals,
      interiorD: save.player.baseAttributes.defense,
      perimeterD: save.player.baseAttributes.defense,
      steal: save.player.baseAttributes.defense,
      block: save.player.baseAttributes.defense,
      oReb: save.player.baseAttributes.rebounding,
      dReb: save.player.baseAttributes.rebounding,
      speed: save.player.baseAttributes.physicals,
      acceleration: save.player.baseAttributes.physicals,
      strength: save.player.baseAttributes.physicals,
      vertical: save.player.baseAttributes.physicals,
      stamina: save.player.baseAttributes.physicals
    },
    badgePoints: 0,
    badges: [],
    milestones: {
      threeMade: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      dunks: 0,
      stops: 0,
      deepThrees: 0
    },
    energy: 8,
    mood: 8,
    clout: 0,
    chemistry: 70,
    health: 100,
    reputation: 0,
    seasonCapUsed: 0
  };

  // Get opponent info
  const opponent = TEAMS[finalOpponentId] || Object.values(TEAMS)[0];
  const opponentTeam = {
    name: opponent.name,
    strength: Math.floor(Math.random() * 4) - 1, // -1 to 2
    style: ['aggressive', 'defensive', 'balanced', 'fast-paced'][Math.floor(Math.random() * 4)] as 'aggressive' | 'defensive' | 'balanced' | 'fast-paced'
  };

  // Run simulation
  const gameResult = simulateGame(player, opponentTeam, player.energy);

  // Calculate deltas
  const energyCost = gameResult.energyUsed;
  const chemistryDelta = gameResult.teamStats.win ? 2 : -1;
  const reputationDelta = gameResult.teamStats.win ? 1 : 0;
  const moodDelta = gameResult.teamStats.win ? 1 : -1;

  const result: SimulationResult = {
    statsDelta: {
      energy: -energyCost,
      chemistry: chemistryDelta,
      mood: moodDelta,
      reputation: reputationDelta
    },
    chemistryDelta,
    energyCost,
    result: {
      points: gameResult.playerStats.points,
      rebounds: gameResult.playerStats.rebounds,
      assists: gameResult.playerStats.assists,
      won: gameResult.teamStats.win,
      opponentName: opponent.name,
      playerScore: gameResult.teamStats.playerScore,
      opponentScore: gameResult.teamStats.opponentScore
    }
  };

  // Add injury if applicable
  if (gameResult.injuryRisk) {
    const injuryTypes = ['Ankle Sprain', 'Knee Strain', 'Back Soreness', 'Wrist Sprain'];
    const injuryType = injuryTypes[Math.floor(Math.random() * injuryTypes.length)];
    result.injuries = {
      type: injuryType,
      weeksRemaining: Math.floor(Math.random() * 3) + 1, // 1-3 weeks
      description: `Minor ${injuryType.toLowerCase()}`
    };
  }

  result.reputation = reputationDelta;

  return result;
}

// Apply simulation results to SaveState
export function applySimulationResults(save: SaveState, simResult: SimulationResult): SaveState {
  // Create new result entry
  const currentGame = save.season.schedule.find(g => g.week === save.week);
  if (!currentGame) return save;

  const newResult = {
    week: save.week,
    opponentId: currentGame.opponentId,
    home: currentGame.home,
    points: simResult.result.points,
    rebounds: simResult.result.rebounds,
    assists: simResult.result.assists,
    won: simResult.result.won
  };

  // Update standings
  const newStandings = { ...save.season.standings };
  if (newStandings[save.playerTeamId]) {
    if (simResult.result.won) {
      newStandings[save.playerTeamId].w++;
    } else {
      newStandings[save.playerTeamId].l++;
    }
  }
  if (newStandings[currentGame.opponentId]) {
    if (!simResult.result.won) {
      newStandings[currentGame.opponentId].w++;
    } else {
      newStandings[currentGame.opponentId].l++;
    }
  }

  return {
    ...save,
    season: {
      ...save.season,
      results: [...save.season.results, newResult],
      standings: newStandings
    }
  };
}