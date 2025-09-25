import type { Player, Game, TeamRecord, AttributeSet } from '@/types';

// Simple seeded random number generator
function createSeededRNG(seed: string) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = Math.imul(31, s) + seed.charCodeAt(i) | 0;
  }
  
  return function() {
    s = Math.imul(1103515245, s) + 12345 | 0;
    return (s >>> 0) / 4294967296;
  };
}

// Deterministic simulation engine
export function simulateGame(
  player: Player,
  game: Game,
  home: TeamRecord,
  away: TeamRecord,
  attrs: AttributeSet,
  playerTeamId: string
): { 
  updatedGame: Game;
  homeUpdate: Partial<TeamRecord>;
  awayUpdate: Partial<TeamRecord>;
} {
  // Create deterministic seed from game data
  const seed = `${game.id}_${game.week}_${player.id}`;
  const rng = createSeededRNG(seed);

  // Calculate player overall rating
  const playerOverall = Math.round(
    attrs.shooting * 0.35 +
    attrs.finishing * 0.2 +
    attrs.defense * 0.15 +
    attrs.rebounding * 0.1 +
    attrs.physicals * 0.2
  );

  // Add small random factor for variety
  const playerRating = Math.max(40, Math.min(99, playerOverall + (rng() * 10 - 5)));

  // Calculate team strengths (base 70-85 + random)
  let homeStrength = 70 + rng() * 15;
  let awayStrength = 70 + rng() * 15;

  // If player's team is playing, boost their team strength
  const isPlayerHome = game.homeTeamId === playerTeamId;
  const isPlayerAway = game.awayTeamId === playerTeamId;

  if (isPlayerHome) {
    homeStrength += (playerRating / 100) * 15 + (player.chemistry / 100) * 5;
  } else if (isPlayerAway) {
    awayStrength += (playerRating / 100) * 15 + (player.chemistry / 100) * 5;
  }

  // Generate realistic high school scores (45-80 range)
  const baseScore = 55;
  const homeScore = Math.round(
    baseScore + (homeStrength - 70) / 3 + (rng() * 20 - 10)
  );
  const awayScore = Math.round(
    baseScore + (awayStrength - 70) / 3 + (rng() * 20 - 10)
  );

  // Clamp to realistic range
  const finalHomeScore = Math.max(35, Math.min(85, homeScore));
  const finalAwayScore = Math.max(35, Math.min(85, awayScore));

  // Generate player stats if they're playing
  let playerLine = undefined;
  if (isPlayerHome || isPlayerAway) {
    // Energy affects performance
    const energyMultiplier = player.energy < 40 ? 0.9 : 1.0;
    
    // Generate stats based on attributes with realistic HS ranges
    const basePts = (attrs.shooting + attrs.finishing) / 8;
    const baseReb = attrs.rebounding / 5;
    const baseAst = attrs.shooting / 8; // Playmaking proxy
    const baseStl = attrs.defense / 15;
    const baseBlk = attrs.defense / 20;

    playerLine = {
      pts: Math.max(0, Math.min(45, Math.round((basePts + rng() * 10 - 5) * energyMultiplier))),
      reb: Math.max(0, Math.min(18, Math.round((baseReb + rng() * 6 - 3) * energyMultiplier))),
      ast: Math.max(0, Math.min(12, Math.round((baseAst + rng() * 4 - 2) * energyMultiplier))),
      stl: Math.max(0, Math.min(6, Math.round((baseStl + rng() * 2 - 1) * energyMultiplier))),
      blk: Math.max(0, Math.min(6, Math.round((baseBlk + rng() * 2 - 1) * energyMultiplier)))
    };
  }

  // Create updated game
  const updatedGame: Game = {
    ...game,
    played: true,
    score: {
      home: finalHomeScore,
      away: finalAwayScore
    },
    playerLine
  };

  // Calculate record updates
  const homeWon = finalHomeScore > finalAwayScore;
  
  const homeUpdate: Partial<TeamRecord> = {
    gp: (home.gp || 0) + 1,
    w: (home.w || 0) + (homeWon ? 1 : 0),
    l: (home.l || 0) + (homeWon ? 0 : 1),
    pf: (home.pf || 0) + finalHomeScore,
    pa: (home.pa || 0) + finalAwayScore
  };

  const awayUpdate: Partial<TeamRecord> = {
    gp: (away.gp || 0) + 1,
    w: (away.w || 0) + (homeWon ? 0 : 1),
    l: (away.l || 0) + (homeWon ? 1 : 0),
    pf: (away.pf || 0) + finalAwayScore,
    pa: (away.pa || 0) + finalHomeScore
  };

  return {
    updatedGame,
    homeUpdate,
    awayUpdate
  };
}

// Helper to calculate season rollover
export function shouldAdvanceSeason(week: number, totalWeeks: number): boolean {
  return week > totalWeeks;
}

// Helper to calculate new player age
export function calculatePlayerAge(player: Player, currentYear: number, currentWeek: number): number {
  const baseAge = player.startAge + (currentYear - player.startYear);
  
  // If it's August (week 1 of new season) or later, player has had birthday
  const birthMonth = player.birthMonth || 8; // Default to August
  const hasHadBirthday = currentWeek >= 1; // Simplified for HS seasons
  
  return hasHadBirthday ? baseAge : baseAge;
}