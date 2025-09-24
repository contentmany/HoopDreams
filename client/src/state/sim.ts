import { TEAMS } from '@/data/teams';
import { CONFERENCES } from '@/data/conferences';

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
  id: string;
  name: string;
  gamesRemaining: number;
  boost: { attr: keyof Attributes; amount: number };
}

export interface SaveState {
  year: number;
  week: number;
  age: number;
  birthdayWeek: number;
  playerTeamId: string;
  season: Season;
  awards: string[];
  history: { label: string; dateISO: string }[];
  accessories: AccessoryInstance[];
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
      age: 16,
      birthdayWeek: 10,
      playerTeamId: 'cvhs',
      season: newSeason(2024, 'cvhs', 'northern'),
      awards: [],
      history: [{ label: 'Started high school career', dateISO: new Date().toISOString() }],
      accessories: [],
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

export function applyAccessoryBoosts(base: Attributes, acc: AccessoryInstance[]): Attributes {
  const boosted = { ...base };
  
  for (const accessory of acc) {
    if (accessory.gamesRemaining > 0) {
      boosted[accessory.boost.attr] += accessory.boost.amount;
    }
  }
  
  return boosted;
}

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
  // Step 1: Check if there's a game to play
  const g = getNextGame(s);
  if (!g) return s; // no-op
  
  // Step 2: Build effective attributes
  const effectiveAttrs = applyAccessoryBoosts(s.player.baseAttributes, s.accessories.filter(acc => acc.gamesRemaining > 0));
  
  // Step 3: Create randomized Result
  const stats = randStats(effectiveAttrs);
  const playerRating = (effectiveAttrs.shooting + effectiveAttrs.finishing + effectiveAttrs.physicals) / 3;
  const winChance = Math.min(0.95, Math.max(0.05, 0.5 + (playerRating - 70) * 0.01)); // Rating bias
  const won = Math.random() < winChance;
  
  const result: Result = {
    week: g.week,
    opponentId: g.opponentId,
    home: g.home,
    points: stats.points,
    rebounds: stats.rebounds,
    assists: stats.assists,
    won
  };
  
  // Step 4: Push result
  const newResults = [...s.season.results, result];
  
  // Step 5: Decrement gamesRemaining for equipped accessories
  const updatedAccessories = s.accessories.map(acc => ({
    ...acc,
    gamesRemaining: acc.gamesRemaining > 0 ? acc.gamesRemaining - 1 : 0
  }));
  
  // Step 6: Update standings
  const newStandings = { ...s.season.standings };
  updateStandings(newStandings, s.playerTeamId, g.opponentId, won);
  
  // Step 7: Save and return
  const updatedState = {
    ...s,
    accessories: updatedAccessories,
    season: {
      ...s.season,
      results: newResults,
      standings: newStandings
    }
  };
  
  saveSave(updatedState);
  return updatedState;
}

export function advanceWeek(s: SaveState): SaveState {
  // Step 1: Play current game (ensures Play and Sim are identical)
  let updatedState = playCurrentGame(s);
  
  // Step 2: Increment week
  updatedState = { ...updatedState, week: updatedState.week + 1 };
  
  // Step 3: Check for birthday
  if (updatedState.week === updatedState.birthdayWeek) {
    updatedState = {
      ...updatedState,
      age: updatedState.age + 1,
      history: [
        ...updatedState.history,
        { label: `Turned ${updatedState.age + 1} years old`, dateISO: new Date().toISOString() }
      ]
    };
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