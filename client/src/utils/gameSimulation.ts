import type { Player, Attributes } from './localStorage';
import { difficultySettings } from './gameConfig';
import { settings } from './localStorage';

export interface GameResult {
  playerStats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    fgm: number;
    fga: number;
    threePM: number;
    threePA: number;
    ftm: number;
    fta: number;
    minutes: number;
  };
  teamStats: {
    playerScore: number;
    opponentScore: number;
    win: boolean;
  };
  milestoneUpdates: Record<string, number>;
  energyUsed: number;
  injuryRisk: boolean;
  gameGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
}

export interface OpponentTeam {
  name: string;
  strength: number; // -5 to +5 relative to player
  style: 'aggressive' | 'defensive' | 'balanced' | 'fast-paced';
}

// Generate random opponent teams
export const generateOpponentTeam = (week: number, difficulty: 'Easy' | 'Normal' | 'Hard'): OpponentTeam => {
  const teams = [
    'Central Valley High', 'Riverside Academy', 'Oak Hills Prep', 'Westside Warriors',
    'Mountain View Lions', 'Pine Ridge Eagles', 'Lakewood Rams', 'Sunset Panthers',
    'Northside Titans', 'Eastwood Falcons', 'Canyon Creek Wolves', 'Valley Vista Bears',
    'Highland Storm', 'Coastal Sharks', 'Desert Thunder', 'Forest Grove Stallions'
  ];
  
  const styles: OpponentTeam['style'][] = ['aggressive', 'defensive', 'balanced', 'fast-paced'];
  const difficultyModifier = difficultySettings[difficulty].opponentStrength;
  
  // Opponent strength increases slightly throughout the season
  const seasonProgression = Math.floor(week / 4); // Increase every 4 weeks
  const baseStrength = Math.random() * 4 - 2; // -2 to +2 base
  const strength = Math.max(-5, Math.min(5, baseStrength + difficultyModifier + seasonProgression));
  
  return {
    name: teams[Math.floor(Math.random() * teams.length)],
    strength,
    style: styles[Math.floor(Math.random() * styles.length)]
  };
};

// Calculate player performance based on attributes and opponent
const calculatePlayerPerformance = (
  player: Player, 
  opponent: OpponentTeam, 
  energyLevel: number
): GameResult['playerStats'] => {
  const attrs = player.attributes;
  const fatigue = Math.max(0.6, energyLevel / 10); // Energy affects performance
  const heightBonus = player.heightInches > 75 ? 1.1 : player.heightInches < 70 ? 0.9 : 1.0;
  
  // Calculate base performance from attributes
  const offensiveRating = (attrs.close + attrs.mid + attrs.three + attrs.drivingLayup + attrs.drivingDunk) / 5;
  const playmaking = (attrs.passAccuracy + attrs.ballHandle + attrs.speedWithBall) / 3;
  const defensive = (attrs.interiorD + attrs.perimeterD + attrs.steal + attrs.block) / 4;
  const rebounding = (attrs.oReb + attrs.dReb) / 2;
  
  // Apply opponent difficulty and style modifiers
  let offensiveEfficiency = 1.0;
  let defensiveEfficiency = 1.0;
  
  switch (opponent.style) {
    case 'aggressive':
      offensiveEfficiency *= (1.1 - opponent.strength * 0.02); // Aggressive defense hurts offense
      defensiveEfficiency *= (1.05 + opponent.strength * 0.01); // More turnovers to cause
      break;
    case 'defensive':
      offensiveEfficiency *= (0.85 - opponent.strength * 0.025); // Strong defense
      defensiveEfficiency *= (1.0 + opponent.strength * 0.015);
      break;
    case 'fast-paced':
      offensiveEfficiency *= (1.05 + attrs.speed / 100); // Speed helps in fast pace
      defensiveEfficiency *= (1.0 + attrs.acceleration / 100);
      break;
    case 'balanced':
      offensiveEfficiency *= (1.0 - opponent.strength * 0.015);
      defensiveEfficiency *= (1.0 + opponent.strength * 0.01);
      break;
  }
  
  // Generate random variance (±20%)
  const offenseVariance = 0.8 + Math.random() * 0.4;
  const defenseVariance = 0.8 + Math.random() * 0.4;
  
  // Calculate final stats
  const baseMinutes = 32; // High school game minutes
  const minutes = Math.max(20, baseMinutes * fatigue);
  
  // Shooting stats
  const fga = Math.round((12 + Math.random() * 8) * offensiveRating / 70 * offensiveEfficiency * offenseVariance);
  const fgPct = Math.max(0.2, Math.min(0.7, (offensiveRating / 100) * offensiveEfficiency * offenseVariance));
  const fgm = Math.round(fga * fgPct);
  
  const threePA = Math.round(fga * (attrs.three / 100) * 0.5);
  const threePct = Math.max(0.15, Math.min(0.55, (attrs.three / 100) * offensiveEfficiency * offenseVariance));
  const threePM = Math.round(threePA * threePct);
  
  const fta = Math.round((2 + Math.random() * 6) * (attrs.drivingLayup + attrs.drivingDunk) / 150);
  const ftPct = Math.max(0.4, Math.min(0.95, (attrs.freeThrow / 100)));
  const ftm = Math.round(fta * ftPct);
  
  // Points calculation
  const points = fgm * 2 + threePM * 1 + ftm; // 2s count as 2, 3s add 1 more, FTs count as 1
  
  // Other stats
  const rebounds = Math.round((6 + Math.random() * 8) * rebounding / 70 * heightBonus * defenseVariance);
  const assists = Math.round((3 + Math.random() * 7) * playmaking / 80 * offenseVariance);
  const steals = Math.round((1 + Math.random() * 3) * attrs.steal / 80 * defensiveEfficiency * defenseVariance);
  const blocks = Math.round((0.5 + Math.random() * 2.5) * attrs.block / 70 * heightBonus * defenseVariance);
  const turnovers = Math.round((2 + Math.random() * 4) * (100 - attrs.ballHandle) / 80 * (2 - offensiveEfficiency));
  
  return {
    points: Math.max(0, points),
    rebounds: Math.max(0, rebounds),
    assists: Math.max(0, assists),
    steals: Math.max(0, steals),
    blocks: Math.max(0, blocks),
    turnovers: Math.max(0, turnovers),
    fgm: Math.max(0, fgm),
    fga: Math.max(1, fga),
    threePM: Math.max(0, threePM),
    threePA: Math.max(0, threePA),
    ftm: Math.max(0, ftm),
    fta: Math.max(0, fta),
    minutes: Math.round(minutes)
  };
};

// Calculate team result
const calculateTeamResult = (
  playerStats: GameResult['playerStats'], 
  opponent: OpponentTeam,
  player: Player
): GameResult['teamStats'] => {
  // Estimate team performance around player
  const playerContribution = playerStats.points;
  const teamChemistry = (player.chemistry || 65) / 100;
  
  // Team scores usually between 45-85 points in high school
  const baseTeamScore = 55 + Math.random() * 20;
  const playerScore = Math.round(baseTeamScore + playerContribution * teamChemistry);
  
  // Opponent score based on their strength and style
  const opponentBase = 55 + Math.random() * 20;
  const strengthModifier = opponent.strength * 3;
  let styleModifier = 0;
  
  switch (opponent.style) {
    case 'aggressive': styleModifier = 5; break;
    case 'fast-paced': styleModifier = 8; break;
    case 'defensive': styleModifier = -5; break;
    case 'balanced': styleModifier = 0; break;
  }
  
  const opponentScore = Math.round(opponentBase + strengthModifier + styleModifier);
  
  return {
    playerScore: Math.max(30, playerScore),
    opponentScore: Math.max(30, opponentScore),
    win: playerScore > opponentScore
  };
};

// Calculate game grade based on performance
const calculateGameGrade = (playerStats: GameResult['playerStats'], teamResult: GameResult['teamStats']): GameResult['gameGrade'] => {
  const efficiency = (playerStats.points + playerStats.rebounds + playerStats.assists) / Math.max(1, playerStats.turnovers + 3);
  const impact = playerStats.points * 0.4 + playerStats.assists * 0.3 + playerStats.rebounds * 0.3;
  const winBonus = teamResult.win ? 1.2 : 0.9;
  
  const totalScore = (efficiency * 10 + impact * 0.5) * winBonus;
  
  if (totalScore >= 90) return 'A+';
  if (totalScore >= 87) return 'A';
  if (totalScore >= 83) return 'A-';
  if (totalScore >= 80) return 'B+';
  if (totalScore >= 77) return 'B';
  if (totalScore >= 73) return 'B-';
  if (totalScore >= 70) return 'C+';
  if (totalScore >= 65) return 'C';
  if (totalScore >= 60) return 'C-';
  if (totalScore >= 50) return 'D';
  return 'F';
};

// Calculate milestone updates
const calculateMilestoneUpdates = (playerStats: GameResult['playerStats'], teamResult: GameResult['teamStats']): Record<string, number> => {
  const updates: Record<string, number> = {};
  
  // Games played
  updates.gamesPlayed = 1;
  
  // Wins
  if (teamResult.win) {
    updates.wins = 1;
  }
  
  // Double-doubles and triple-doubles
  const doubleDigitStats = [
    playerStats.points >= 10 ? 1 : 0,
    playerStats.rebounds >= 10 ? 1 : 0,
    playerStats.assists >= 10 ? 1 : 0,
    playerStats.steals >= 10 ? 1 : 0,
    playerStats.blocks >= 10 ? 1 : 0,
  ].filter(x => x).length;
  
  if (doubleDigitStats >= 2) {
    updates.doubleDoubles = 1;
  }
  if (doubleDigitStats >= 3) {
    updates.tripleDoubles = 1;
  }
  
  // Scoring milestones
  if (playerStats.points >= 20) {
    updates.twentyPointGames = 1;
  }
  if (playerStats.points >= 30) {
    updates.thirtyPointGames = 1;
  }
  
  // Three-point milestones  
  if (playerStats.threePM >= 3) {
    updates.threePointerGames = 1;
  }
  if (playerStats.threePM >= 5) {
    updates.fiveThreePointerGames = 1;
  }
  
  // Defensive milestones
  if (playerStats.steals >= 3) {
    updates.stealGames = 1;
  }
  if (playerStats.blocks >= 3) {
    updates.blockGames = 1;
  }
  
  // Career totals
  updates.careerPoints = playerStats.points;
  updates.careerRebounds = playerStats.rebounds;
  updates.careerAssists = playerStats.assists;
  updates.careerSteals = playerStats.steals;
  updates.careerBlocks = playerStats.blocks;
  
  return updates;
};

// Main simulation function
export const simulateGame = (
  player: Player, 
  opponent: OpponentTeam, 
  energyLevel: number = 8
): GameResult => {
  const currentSettings = settings.get();
  const difficulty = difficultySettings[currentSettings.difficulty] || difficultySettings.Normal;
  
  // Calculate player performance
  const playerStats = calculatePlayerPerformance(player, opponent, energyLevel);
  
  // Calculate team result
  const teamStats = calculateTeamResult(playerStats, opponent, player);
  
  // Calculate milestone updates
  const milestoneUpdates = calculateMilestoneUpdates(playerStats, teamStats);
  
  // Calculate energy cost and injury risk
  const baseEnergyCost = 3;
  const intensityMultiplier = opponent.strength > 2 ? 1.2 : opponent.strength < -2 ? 0.8 : 1.0;
  const energyUsed = Math.round(baseEnergyCost * intensityMultiplier);
  
  const injuryRisk = Math.random() < (0.02 * difficulty.injuryChance * (energyLevel < 3 ? 2 : 1));
  
  // Calculate game grade
  const gameGrade = calculateGameGrade(playerStats, teamStats);
  
  return {
    playerStats,
    teamStats,
    milestoneUpdates,
    energyUsed,
    injuryRisk,
    gameGrade
  };
};

// Quick simulation (for SIM functionality)
export const quickSimulateGame = (
  player: Player, 
  opponent: OpponentTeam,
  energyLevel: number = 8
): Partial<GameResult> => {
  // Simplified simulation for quick results
  const result = simulateGame(player, opponent, energyLevel);
  
  return {
    teamStats: result.teamStats,
    milestoneUpdates: result.milestoneUpdates,
    energyUsed: result.energyUsed,
    gameGrade: result.gameGrade
  };
};