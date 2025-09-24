import { TEAMS } from '@/data/teams';
import { CONFERENCES } from '@/data/conferences';

// Types
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

export interface Attributes {
  shooting: number;
  finishing: number;
  defense: number;
  rebounding: number;
  physicals: number;
}

export interface SaveState {
  year: number;
  week: number; // 1..20 then "T1.." etc
  age: number;
  birthdayWeek: number;
  playerTeamId: string;
  season: Season;
  awards: string[];
  history: { label: string; dateISO: string }[];
  accessories: AccessoryInstance[];
}

const SAVE_KEY = 'hd.save.state.v1';

// Functions
export function newSeason(year: number, playerTeamId: string, conferenceId: string): Season {
  const conference = CONFERENCES[conferenceId];
  if (!conference) throw new Error(`Conference ${conferenceId} not found`);
  
  const conferenceTeams = conference.teams;
  const allTeams = Object.keys(TEAMS);
  const nonConferenceTeams = allTeams.filter(id => !conferenceTeams.includes(id));
  
  // Generate 20-week schedule: 16 conference games + 4 non-conference
  const schedule: Game[] = [];
  let week = 1;
  
  // Conference games (play each team in conference 4 times - home and away twice)
  for (let round = 0; round < 4; round++) {
    for (const opponentId of conferenceTeams) {
      if (opponentId !== playerTeamId && week <= 16) {
        schedule.push({
          week: week++,
          opponentId,
          home: Math.random() > 0.5
        });
      }
    }
  }
  
  // Fill remaining weeks with non-conference games
  while (week <= 20 && nonConferenceTeams.length > 0) {
    const randomOpponent = nonConferenceTeams[Math.floor(Math.random() * nonConferenceTeams.length)];
    schedule.push({
      week: week++,
      opponentId: randomOpponent,
      home: Math.random() > 0.5
    });
  }
  
  // Initialize standings
  const standings: Record<string, { w: number; l: number }> = {};
  for (const teamId of conferenceTeams) {
    standings[teamId] = { w: 0, l: 0 };
  }
  
  return {
    year,
    level: "High School",
    conferenceId,
    schedule: schedule.slice(0, 20), // Ensure exactly 20 games
    results: [],
    standings
  };
}

export function loadSave(): SaveState | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load save state:', error);
  }
  return null;
}

export function saveSave(saveState: SaveState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveState));
  } catch (error) {
    console.warn('Failed to save state:', error);
  }
}

export function applyAccessoryBoosts(baseAttributes: Attributes, accessories: AccessoryInstance[]): Attributes {
  const boosted = { ...baseAttributes };
  
  for (const accessory of accessories) {
    if (accessory.gamesRemaining > 0) {
      boosted[accessory.boost.attr] += accessory.boost.amount;
    }
  }
  
  return boosted;
}

export function playGameOnce(saveState: SaveState): SaveState {
  const currentGame = saveState.season.schedule.find(g => g.week === saveState.week);
  if (!currentGame) return saveState;
  
  // Simple game simulation - generate random but reasonable stats
  const points = Math.floor(Math.random() * 20) + 8; // 8-27 points
  const rebounds = Math.floor(Math.random() * 8) + 2; // 2-9 rebounds  
  const assists = Math.floor(Math.random() * 6) + 1; // 1-6 assists
  const won = Math.random() > 0.4; // 60% win rate
  
  const result: Result = {
    week: currentGame.week,
    opponentId: currentGame.opponentId,
    home: currentGame.home,
    points,
    rebounds,
    assists,
    won
  };
  
  // Update standings
  const updatedStandings = { ...saveState.season.standings };
  if (updatedStandings[saveState.playerTeamId]) {
    if (won) {
      updatedStandings[saveState.playerTeamId].w++;
    } else {
      updatedStandings[saveState.playerTeamId].l++;
    }
  }
  
  // Update opponent standings (opposite result)
  if (updatedStandings[currentGame.opponentId]) {
    if (!won) {
      updatedStandings[currentGame.opponentId].w++;
    } else {
      updatedStandings[currentGame.opponentId].l++;
    }
  }
  
  // Decrement accessory games remaining
  const updatedAccessories = saveState.accessories.map(acc => ({
    ...acc,
    gamesRemaining: Math.max(0, acc.gamesRemaining - 1)
  }));
  
  return {
    ...saveState,
    season: {
      ...saveState.season,
      results: [...saveState.season.results, result],
      standings: updatedStandings
    },
    accessories: updatedAccessories
  };
}

export function simOneWeek(saveState: SaveState): SaveState {
  let updatedState = playGameOnce(saveState);
  
  // Check for birthday
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
  
  // Increment week
  updatedState.week++;
  
  return updatedState;
}

export function runConferenceTournament(saveState: SaveState): SaveState {
  const standings = Object.entries(saveState.season.standings)
    .map(([teamId, record]) => ({
      teamId,
      wins: record.w,
      losses: record.l,
      winPct: record.w / (record.w + record.l || 1)
    }))
    .sort((a, b) => b.winPct - a.winPct)
    .slice(0, 8); // Top 8 teams
  
  const playerRank = standings.findIndex(s => s.teamId === saveState.playerTeamId);
  let updatedState = { ...saveState };
  
  if (playerRank >= 0 && playerRank < 8) {
    // Player made the tournament
    const tournamentResult = Math.random() > 0.5; // 50% chance to win tournament
    
    if (tournamentResult) {
      // Won conference tournament
      updatedState.awards.push(`Conference Champion (${saveState.year})`);
      updatedState.history.push({
        label: `Won Conference Championship`,
        dateISO: new Date().toISOString()
      });
    } else {
      // Lost in tournament
      updatedState.history.push({
        label: `Lost in Conference Tournament`,
        dateISO: new Date().toISOString()
      });
    }
  } else {
    // Didn't make tournament
    updatedState.history.push({
      label: `Missed Conference Tournament`,
      dateISO: new Date().toISOString()
    });
  }
  
  return updatedState;
}

export function simToEndOfSeason(saveState: SaveState): SaveState {
  let updatedState = saveState;
  
  // Sim remaining weeks to 20
  while (updatedState.week <= 20) {
    updatedState = simOneWeek(updatedState);
  }
  
  // Run conference tournament
  updatedState = runConferenceTournament(updatedState);
  
  // Advance to next year
  updatedState = {
    ...updatedState,
    year: updatedState.year + 1,
    week: 1,
    season: newSeason(updatedState.year + 1, updatedState.playerTeamId, updatedState.season.conferenceId)
  };
  
  updatedState.history.push({
    label: `Started ${updatedState.year} season`,
    dateISO: new Date().toISOString()
  });
  
  return updatedState;
}