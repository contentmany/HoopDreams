import { TEAMS } from '@/data/teams';
import { CONFERENCES } from '@/data/conferences';
import { applyAccessoryBoosts, onGameResolved } from './accessories';

// Types
export interface Attributes {
  shooting: number;
  finishing: number;
  defense: number;
  rebounding: number;
  physicals: number;
}

export interface Game {
  week: number;
  opponentId: string;
  home: boolean;
}

export interface Result {
  week: number;
  opponentId: string;
  home: boolean;
  points: number;
  rebounds: number;
  assists: number;
  won: boolean;
}

export interface Season {
  year: number;
  level: "High School";
  conferenceId: string;
  schedule: Game[];
  results: Result[];
  standings: Record<string, { w: number; l: number }>;
}

export interface AccessoryInstance {
  instanceId: string;
  accessoryId: string;
  equipped: boolean;
  gamesRemaining: number;
  acquiredISO: string;
}

export interface SaveState {
  year: number;
  week: number;
  age: number;
  birthdayWeek: number;
  graduationAge: number;
  playerTeamId: string;
  season: Season;
  awards: string[];
  history: { label: string; dateISO: string }[];
  accessories: AccessoryInstance[];
  status: {
    schoolPhase: "HighSchool" | "Graduated";
  };
  avatar?: {
    photo?: string;
  };
  player: {
    firstName: string;
    lastName: string;
    position: string;
    archetype: string;
    heightInCm: number;
    baseAttributes: Attributes;
  };
}

const SAVE_KEY = 'hd.save.v1';

// Core persistence
export function loadSave(): SaveState {
  const stored = localStorage.getItem(SAVE_KEY);
  if (!stored) {
    // Return default save state
    return {
      year: 2024,
      week: 1,
      age: 15,
    graduationAge: 18,
      birthdayWeek: 10,
      playerTeamId: 'cvhs',
      season: newSeason(2024, 'cvhs', 'northern'),
      awards: [],
      history: [{ label: 'Started high school career', dateISO: new Date().toISOString() }],
      accessories: [],
      status: {
        schoolPhase: "HighSchool" as const
      },
      player: {
        firstName: 'Your',
        lastName: 'Player',
        position: 'PG',
        archetype: 'Playmaker',
        heightInCm: 180,
        baseAttributes: {
          shooting: 70,
          finishing: 65,
          defense: 60,
          rebounding: 55,
          physicals: 75
        }
      }
    };
  }
  return JSON.parse(stored);
}

export function saveSave(next: SaveState): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(next));
  
  // Import and trigger pub/sub
  import('./saveBus').then(({ publishSaveChanged }) => {
    publishSaveChanged();
  });
}

// Helper functions
export function getNextGame(s: SaveState): Game | null {
  if (s.week > 20) return null; // Season over
  return s.season.schedule.find(g => g.week === s.week) || null;
}

// Removed - using applyAccessoryBoosts from state/accessories.ts instead

export function randStats(attrs: Attributes): { points: number; rebounds: number; assists: number } {
  // Simple RNG influenced by attributes
  const shootingFactor = attrs.shooting / 100;
  const finishingFactor = attrs.finishing / 100;
  const reboundingFactor = attrs.rebounding / 100;
  
  const points = Math.floor(Math.random() * 20) + 8 + (shootingFactor + finishingFactor) * 5;
  const rebounds = Math.floor(Math.random() * 8) + 2 + reboundingFactor * 3;
  const assists = Math.floor(Math.random() * 6) + 1;
  
  return {
    points: Math.round(points),
    rebounds: Math.round(rebounds),
    assists
  };
}

export function updateStandings(standings: Record<string, { w: number; l: number }>, playerTeamId: string, opponentId: string, didWin: boolean): void {
  // Update player team
  if (standings[playerTeamId]) {
    if (didWin) {
      standings[playerTeamId].w++;
    } else {
      standings[playerTeamId].l++;
    }
  }
  
  // Update opponent team  
  if (standings[opponentId]) {
    if (!didWin) {
      standings[opponentId].w++;
    } else {
      standings[opponentId].l++;
    }
  }
}

export function aggregateStats(results: Result[]): { totals: { pts: number; reb: number; ast: number }; perGame: { pts: number; reb: number; ast: number } } {
  if (results.length === 0) {
    return {
      totals: { pts: 0, reb: 0, ast: 0 },
      perGame: { pts: 0, reb: 0, ast: 0 }
    };
  }
  
  const totals = results.reduce(
    (acc, result) => ({
      pts: acc.pts + result.points,
      reb: acc.reb + result.rebounds,
      ast: acc.ast + result.assists
    }),
    { pts: 0, reb: 0, ast: 0 }
  );
  
  const games = results.length;
  return {
    totals,
    perGame: {
      pts: Math.round((totals.pts / games) * 10) / 10,
      reb: Math.round((totals.reb / games) * 10) / 10,
      ast: Math.round((totals.ast / games) * 10) / 10
    }
  };
}

// Season operations
export function newSeason(year: number, playerTeamId: string, conferenceId: string): Season {
  const conference = CONFERENCES[conferenceId];
  if (!conference) throw new Error(`Conference ${conferenceId} not found`);
  
  const conferenceTeams = conference.teams;
  const allTeams = Object.keys(TEAMS);
  const nonConferenceTeams = allTeams.filter(id => !conferenceTeams.includes(id));
  
  // Generate 20-week schedule: 12 conference games + 8 non-conference
  const schedule: Game[] = [];
  let week = 1;
  
  // Conference games (play each team in conference 4 times)
  for (let round = 0; round < 4; round++) {
    for (const opponentId of conferenceTeams) {
      if (opponentId !== playerTeamId && week <= 12) {
        schedule.push({
          week: week++,
          opponentId,
          home: round % 2 === 0 // Alternate home/away by round
        });
      }
    }
  }
  
  // Fill remaining 8 weeks with non-conference games
  while (week <= 20 && nonConferenceTeams.length > 0) {
    const randomOpponent = nonConferenceTeams[Math.floor(Math.random() * nonConferenceTeams.length)];
    schedule.push({
      week: week++,
      opponentId: randomOpponent,
      home: Math.random() > 0.5
    });
  }
  
  // Initialize standings for conference teams
  const standings: Record<string, { w: number; l: number }> = {};
  for (const teamId of conferenceTeams) {
    standings[teamId] = { w: 0, l: 0 };
  }
  
  return {
    year,
    level: "High School",
    conferenceId,
    schedule,
    results: [],
    standings
  };
}

export function runConferenceTournament(s: SaveState): SaveState {
  // Simple 8-team single elimination
  const standings = Object.entries(s.season.standings)
    .map(([teamId, record]) => ({
      teamId,
      wins: record.w,
      losses: record.l,
      winPct: record.w / (record.w + record.l || 1)
    }))
    .sort((a, b) => b.winPct - a.winPct)
    .slice(0, 8); // Top 8 teams
  
  const playerRank = standings.findIndex(st => st.teamId === s.playerTeamId);
  
  if (playerRank === -1) {
    // Player didn't make tournament
    return {
      ...s,
      history: [
        ...s.history,
        { label: 'Did not qualify for conference tournament', dateISO: new Date().toISOString() }
      ]
    };
  }
  
  // Simple tournament simulation - player has 60% chance to advance each round
  let currentRound = 1;
  let playerStillIn = true;
  const newHistory = [...s.history];
  const newAwards = [...s.awards];
  
  while (currentRound <= 3 && playerStillIn) { // 3 rounds for 8-team tournament
    const advanceChance = 0.6;
    const advances = Math.random() < advanceChance;
    
    if (advances) {
      const roundNames = ['Conference Quarterfinals', 'Conference Semifinals', 'Conference Finals'];
      newHistory.push({
        label: `Won ${roundNames[currentRound - 1]}`,
        dateISO: new Date().toISOString()
      });
      
      if (currentRound === 3) {
        newAwards.push('Conference Champion');
        newHistory.push({
          label: 'Won Conference Championship',
          dateISO: new Date().toISOString()
        });
      }
    } else {
      const roundNames = ['Conference Quarterfinals', 'Conference Semifinals', 'Conference Finals'];
      newHistory.push({
        label: `Lost in ${roundNames[currentRound - 1]}`,
        dateISO: new Date().toISOString()
      });
      playerStillIn = false;
    }
    currentRound++;
  }
  
  return {
    ...s,
    awards: newAwards,
    history: newHistory
  };
}

// MOST IMPORTANT: Single call sites
export function playCurrentGame(s: SaveState): SaveState {
  return resolveGame(s);
}

export function advanceWeek(s: SaveState): SaveState {
  // Step 1: Play current game (ensures Play and Sim are identical)
  let updatedState = playCurrentGame(s);
  
  // Step 2: Increment week
  updatedState = { ...updatedState, week: updatedState.week + 1 };
  
  // Step 3: Check for birthday
  if (updatedState.week === updatedState.birthdayWeek) {
    const newAge = updatedState.age + 1;
    updatedState = {
      ...updatedState,
      age: newAge,
      history: [
        ...updatedState.history,
        { label: `Turned ${newAge} years old`, dateISO: new Date().toISOString() }
      ]
    };
    
    // Step 3a: Check for graduation
    if (newAge >= updatedState.graduationAge && updatedState.status.schoolPhase === "HighSchool") {
      updatedState = {
        ...updatedState,
        status: {
          ...updatedState.status,
          schoolPhase: "Graduated"
        },
        history: [
          ...updatedState.history,
          { label: 'Graduated from High School!', dateISO: new Date().toISOString() }
        ]
      };
      
      // Add graduation toast notification
      import('./saveBus').then(({ publishSaveChanged }) => {
        publishSaveChanged();
      });
    }
  }
  
  // Step 4: Handle week boundaries
  if (updatedState.week <= 20) {
    saveSave(updatedState);
    return updatedState;
  }
  
  // Step 5: Postseason - keep week at 21 sentinel
  updatedState = { ...updatedState, week: 21 };
  saveSave(updatedState);
  return updatedState;
}

export function simMultipleWeeks(s: SaveState, n: number): SaveState {
  let current = s;
  for (let i = 0; i < n; i++) {
    if (!getNextGame(current)) break; // No more games
    current = advanceWeek(current);
  }
  return current;
}

export function simToEndOfSeason(s: SaveState): SaveState {
  // Step 1: Play all remaining regular season games
  let current = s;
  while (getNextGame(current)) {
    current = advanceWeek(current);
  }
  
  // Step 2: Run conference tournament
  current = runConferenceTournament(current);
  
  // Step 3: Advance to next year
  current = {
    ...current,
    year: current.year + 1,
    week: 1
  };
  
  // Step 4: Create new season
  current = {
    ...current,
    season: newSeason(current.year, current.playerTeamId, current.season.conferenceId)
  };
  
  // Step 5: Save and return
  saveSave(current);
  return current;
}