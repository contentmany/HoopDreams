import type { Team } from '@/types';

// High school teams with authentic names and conference structure
export const TEAM_DATA: Team[] = [
  // Ohio Conference
  {
    id: 'cvh',
    name: 'Central Valley High',
    abbrev: 'CVH',
    conference: 'Ohio',
    colors: { primary: '#1f3a93', secondary: '#ffffff' }
  },
  {
    id: 'ohp',
    name: 'Oak Hills Prep',
    abbrev: 'OHP', 
    conference: 'Ohio',
    colors: { primary: '#2d5016', secondary: '#ffffff' }
  },
  {
    id: 'rch',
    name: 'River City High',
    abbrev: 'RCH',
    conference: 'Ohio',
    colors: { primary: '#8b0000', secondary: '#ffffff' }
  },
  {
    id: 'mhs',
    name: 'Mountain High School',
    abbrev: 'MHS',
    conference: 'Ohio',
    colors: { primary: '#4a4a4a', secondary: '#ffffff' }
  },
  {
    id: 'lhs',
    name: 'Liberty High School',
    abbrev: 'LHS',
    conference: 'Ohio',
    colors: { primary: '#ff6600', secondary: '#000000' }
  },
  {
    id: 'whe',
    name: 'West Haven Eagles',
    abbrev: 'WHE',
    conference: 'Ohio',
    colors: { primary: '#006bb3', secondary: '#ffffff' }
  },

  // Missouri/Kansas Conference
  {
    id: 'kcp',
    name: 'Kansas City Prep',
    abbrev: 'KCP',
    conference: 'Missouri/Kansas',
    colors: { primary: '#cc0000', secondary: '#ffffff' }
  },
  {
    id: 'sth',
    name: 'St. Thomas High',
    abbrev: 'STH',
    conference: 'Missouri/Kansas',
    colors: { primary: '#003366', secondary: '#ffffff' }
  },
  {
    id: 'wms',
    name: 'Westport Middle School',
    abbrev: 'WMS',
    conference: 'Missouri/Kansas',
    colors: { primary: '#660066', secondary: '#ffffff' }
  },
  {
    id: 'nkh',
    name: 'North Kansas High',
    abbrev: 'NKH',
    conference: 'Missouri/Kansas',
    colors: { primary: '#009966', secondary: '#ffffff' }
  },
  {
    id: 'sha',
    name: 'Shawnee Academy',
    abbrev: 'SHA',
    conference: 'Missouri/Kansas',
    colors: { primary: '#800080', secondary: '#ffffff' }
  },
  {
    id: 'oth',
    name: 'Overland Tech High',
    abbrev: 'OTH',
    conference: 'Missouri/Kansas',
    colors: { primary: '#ffcc00', secondary: '#000000' }
  },

  // Texas Conference
  {
    id: 'dth',
    name: 'Dallas Tech High',
    abbrev: 'DTH',
    conference: 'Texas',
    colors: { primary: '#003f7f', secondary: '#ffffff' }
  },
  {
    id: 'has',
    name: 'Houston Academy South',
    abbrev: 'HAS',
    conference: 'Texas',
    colors: { primary: '#cc0033', secondary: '#ffffff' }
  },
  {
    id: 'apr',
    name: 'Austin Prep',
    abbrev: 'APR',
    conference: 'Texas',
    colors: { primary: '#ff6600', secondary: '#000000' }
  },
  {
    id: 'sah',
    name: 'San Antonio High',
    abbrev: 'SAH',
    conference: 'Texas',
    colors: { primary: '#000000', secondary: '#ffffff' }
  },
  {
    id: 'lth',
    name: 'Lubbock Tech High',
    abbrev: 'LTH',
    conference: 'Texas',
    colors: { primary: '#8b0000', secondary: '#ffffff' }
  },
  {
    id: 'fws',
    name: 'Fort Worth Stallions',
    abbrev: 'FWS',
    conference: 'Texas',
    colors: { primary: '#4a4a4a', secondary: '#ffffff' }
  }
];

export function seedTeams(): Team[] {
  return TEAM_DATA;
}

export function generateInitialSchedule(teams: Team[], totalWeeks: number, playerTeamId: string): any[] {
  const schedule = [];
  const playerTeam = teams.find(t => t.id === playerTeamId);
  if (!playerTeam) return [];

  // Get teams from same conference for most games
  const conferenceTeams = teams.filter(t => 
    t.conference === playerTeam.conference && t.id !== playerTeamId
  );
  
  // Get some out-of-conference teams
  const otherTeams = teams.filter(t => 
    t.conference !== playerTeam.conference
  );

  let gameId = 1;
  for (let week = 1; week <= totalWeeks; week++) {
    // Alternate between home and away
    const isHome = week % 2 === 1;
    
    // Pick opponent - mostly conference teams, some OOC
    let opponent;
    if (week <= 14 && conferenceTeams.length > 0) {
      // Conference games for most of regular season
      opponent = conferenceTeams[(week - 1) % conferenceTeams.length];
    } else {
      // Out of conference games
      opponent = otherTeams[(week - 1) % otherTeams.length];
    }

    if (opponent) {
      schedule.push({
        id: `game_${gameId++}`,
        week,
        homeTeamId: isHome ? playerTeamId : opponent.id,
        awayTeamId: isHome ? opponent.id : playerTeamId,
        played: false
      });
    }
  }

  return schedule;
}

export function standingRows(records: Record<string, any>): any[] {
  const teams = Object.values(records);
  const sortedTeams = teams.sort((a, b) => {
    // Sort by win percentage, then by wins
    const aPct = a.gp > 0 ? a.w / a.gp : 0;
    const bPct = b.gp > 0 ? b.w / b.gp : 0;
    if (aPct !== bPct) return bPct - aPct;
    return b.w - a.w;
  });

  const topTeam = sortedTeams[0];
  const topPct = topTeam && topTeam.gp > 0 ? topTeam.w / topTeam.gp : 0;

  return sortedTeams.map(team => {
    const pct = team.gp > 0 ? team.w / team.gp : 0;
    const gb = topPct > 0 ? (topPct - pct) * team.gp : 0;
    const pfg = team.gp > 0 ? team.pf / team.gp : 0;

    return {
      ...team,
      pct: Math.round(pct * 1000) / 1000,
      gb: Math.round(gb * 10) / 10,
      pfg: Math.round(pfg * 10) / 10
    };
  });
}