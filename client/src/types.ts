// Core type definitions for the basketball life simulator

export interface AttributeSet {
  finishing: number;
  shooting: number;
  rebounding: number;
  defense: number;
  physicals: number;
}

export interface Accessory {
  id: string;
  name: string;
  slot: 'wrist' | 'sleeve' | 'headband' | 'shoes' | 'misc';
  durationGames: number;
  boost: { [K in keyof AttributeSet]?: number };
}

export interface AccessoryOwned extends Accessory {
  owned: boolean;
  equipped: boolean;
}

export interface Team {
  id: string;
  name: string;
  abbrev: string;
  conference: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export interface Game {
  id: string;
  week: number;
  homeTeamId: string;
  awayTeamId: string;
  played: boolean;
  score?: {
    home: number;
    away: number;
  };
  playerLine?: {
    pts: number;
    reb: number;
    ast: number;
    stl: number;
    blk: number;
  };
}

export interface TeamRecord {
  teamId: string;
  gp: number;
  w: number;
  l: number;
  pf: number;
  pa: number;
}

export interface StandingRow extends TeamRecord {
  pct: number;
  gb: number;
  pfg: number;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  startYear: number;
  startAge: number;
  birthMonth?: number; // default 8 (Aug)
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  archetype: string;
  attributes: AttributeSet;
  energy: number;
  health: number;
  chemistry: number;
  reputation: number;
  photo?: string; // dataURL
  awards: string[];
  history: string[];
}

export interface LeagueState {
  level: 'High School';
  year: number;
  week: number;
  totalWeeks: number;
  teams: Team[];
  schedule: Game[];
  records: Record<string, TeamRecord>;
  conferences: string[];
}

export interface CareerState {
  player: Player;
  teamId: string;
  accessories: AccessoryOwned[];
}

export interface RootState {
  isInitialized: boolean;
  league: LeagueState;
  career: CareerState;
}

// Builder types for persistence
export interface BuilderDraft {
  firstName?: string;
  lastName?: string;
  position?: Player['position'];
  archetype?: string;
  attributes?: Partial<AttributeSet>;
  height?: {
    inches: number;
    cm: number;
  };
}