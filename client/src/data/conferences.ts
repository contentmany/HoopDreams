export interface Conference {
  id: string;
  name: string;
  teams: string[];
}

export const CONFERENCES: Record<string, Conference> = {
  northern: {
    id: 'northern',
    name: 'Northern Conference',
    teams: ['cvhs', 'ohp', 'rch', 'mhs']
  },
  coastal: {
    id: 'coastal',
    name: 'Coastal Conference',
    teams: ['sva', 'pchs', 'bwh', 'els']
  },
  metro: {
    id: 'metro',
    name: 'Metro Conference',
    teams: ['uth', 'whs', 'cch', 'nph']
  }
};