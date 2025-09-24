export interface Team {
  id: string;
  name: string;
  abbrev: string;
  conferenceId: string;
  colors: {
    primary: string;
    secondary: string;
  };
  logo: string;
}

export const TEAMS: Record<string, Team> = {
  // Northern Conference
  cvhs: {
    id: 'cvhs',
    name: 'Central Valley High',
    abbrev: 'CVHS',
    conferenceId: 'northern',
    colors: { primary: '#1f3a93', secondary: '#ffffff' },
    logo: '/assets/teams/cvhs.svg'
  },
  ohp: {
    id: 'ohp',
    name: 'Oak Hills Prep',
    abbrev: 'OHP',
    conferenceId: 'northern',
    colors: { primary: '#2d5016', secondary: '#ffffff' },
    logo: '/assets/teams/ohp.svg'
  },
  rch: {
    id: 'rch',
    name: 'River City High',
    abbrev: 'RCH',
    conferenceId: 'northern',
    colors: { primary: '#8b0000', secondary: '#ffffff' },
    logo: '/assets/teams/rch.svg'
  },
  mhs: {
    id: 'mhs',
    name: 'Mountain High School',
    abbrev: 'MHS',
    conferenceId: 'northern',
    colors: { primary: '#4a4a4a', secondary: '#ffffff' },
    logo: '/assets/teams/mhs.svg'
  },
  
  // Coastal Conference
  sva: {
    id: 'sva',
    name: 'Seaside Valley Academy',
    abbrev: 'SVA',
    conferenceId: 'coastal',
    colors: { primary: '#006bb3', secondary: '#ffffff' },
    logo: '/assets/teams/sva.svg'
  },
  pchs: {
    id: 'pchs',
    name: 'Pacific Coast High',
    abbrev: 'PCHS',
    conferenceId: 'coastal',
    colors: { primary: '#ff6600', secondary: '#ffffff' },
    logo: '/assets/teams/pchs.svg'
  },
  bwh: {
    id: 'bwh',
    name: 'Bayside West High',
    abbrev: 'BWH',
    conferenceId: 'coastal',
    colors: { primary: '#660066', secondary: '#ffffff' },
    logo: '/assets/teams/bwh.svg'
  },
  els: {
    id: 'els',
    name: 'East Lake School',
    abbrev: 'ELS',
    conferenceId: 'coastal',
    colors: { primary: '#009966', secondary: '#ffffff' },
    logo: '/assets/teams/els.svg'
  },
  
  // Metro Conference
  uth: {
    id: 'uth',
    name: 'Urban Tech High',
    abbrev: 'UTH',
    conferenceId: 'metro',
    colors: { primary: '#cc0000', secondary: '#ffffff' },
    logo: '/assets/teams/uth.svg'
  },
  whs: {
    id: 'whs',
    name: 'Washington High School',
    abbrev: 'WHS',
    conferenceId: 'metro',
    colors: { primary: '#003366', secondary: '#ffffff' },
    logo: '/assets/teams/whs.svg'
  },
  cch: {
    id: 'cch',
    name: 'City Center High',
    abbrev: 'CCH',
    conferenceId: 'metro',
    colors: { primary: '#ffcc00', secondary: '#000000' },
    logo: '/assets/teams/cch.svg'
  },
  nph: {
    id: 'nph',
    name: 'North Park High',
    abbrev: 'NPH',
    conferenceId: 'metro',
    colors: { primary: '#800080', secondary: '#ffffff' },
    logo: '/assets/teams/nph.svg'
  }
};