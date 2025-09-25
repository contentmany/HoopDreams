import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RootState, Player, AttributeSet, BuilderDraft, Game, TeamRecord } from '@/types';
import { seedTeams, generateInitialSchedule, standingRows } from '@/lib/teamData';
import { simulateGame, shouldAdvanceSeason, calculatePlayerAge } from '@/lib/sim';

const STORAGE_KEY = 'hoop-dreams-game-state';
const DRAFT_KEY = 'hoop-dreams-builder-draft';

interface GameStore extends RootState {
  // Actions
  initIfNeeded: () => void;
  setPhoto: (dataUrl: string) => void;
  saveBuilderDraft: (draft: BuilderDraft) => void;
  getBuilderDraft: () => BuilderDraft | null;
  applyBuilderDraft: () => void;
  advanceWeek: (n?: number) => void;
  advanceToSeasonEnd: () => void;
  playNextGame: () => boolean;
  toggleAccessoryEquip: (id: string) => void;
  getNextGame: () => Game | null;
  getStandingsByConference: (conference: string) => any[];
  getCurrentAge: () => number;
}

const createDefaultPlayer = (): Player => ({
  id: 'player_1',
  firstName: 'Your',
  lastName: 'Player',
  startYear: new Date().getFullYear(),
  startAge: 15,
  birthMonth: 8,
  position: 'PG',
  archetype: 'Balanced',
  attributes: {
    finishing: 60,
    shooting: 55,
    rebounding: 45,
    defense: 40,
    physicals: 65
  },
  energy: 100,
  health: 100,
  chemistry: 70,
  reputation: 50,
  awards: [],
  history: []
});

const createDefaultState = (): RootState => {
  const teams = seedTeams();
  const playerTeamId = teams[0].id; // Default to first team
  const currentYear = new Date().getFullYear();
  const totalWeeks = 20;
  
  const schedule = generateInitialSchedule(teams, totalWeeks, playerTeamId);
  
  // Initialize empty records for all teams
  const records: Record<string, TeamRecord> = {};
  teams.forEach(team => {
    records[team.id] = {
      teamId: team.id,
      gp: 0,
      w: 0,
      l: 0,
      pf: 0,
      pa: 0
    };
  });

  return {
    league: {
      level: 'High School',
      year: currentYear,
      week: 1,
      totalWeeks,
      teams,
      schedule,
      records,
      conferences: ['Ohio', 'Missouri/Kansas', 'Texas']
    },
    career: {
      player: createDefaultPlayer(),
      teamId: playerTeamId,
      accessories: []
    }
  };
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createDefaultState(),

      initIfNeeded: () => {
        const state = get();
        if (!state.career.player.id || state.career.player.id === 'player_1') {
          set(createDefaultState());
        }
      },

      setPhoto: (dataUrl: string) => {
        set((state) => ({
          career: {
            ...state.career,
            player: {
              ...state.career.player,
              photo: dataUrl
            }
          }
        }));
      },

      saveBuilderDraft: (draft: BuilderDraft) => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      },

      getBuilderDraft: () => {
        const stored = localStorage.getItem(DRAFT_KEY);
        return stored ? JSON.parse(stored) : null;
      },

      applyBuilderDraft: () => {
        const draft = get().getBuilderDraft();
        if (!draft) return;

        set((state) => ({
          career: {
            ...state.career,
            player: {
              ...state.career.player,
              firstName: draft.firstName || state.career.player.firstName,
              lastName: draft.lastName || state.career.player.lastName,
              position: draft.position || state.career.player.position,
              archetype: draft.archetype || state.career.player.archetype,
              attributes: {
                ...state.career.player.attributes,
                ...draft.attributes
              }
            }
          }
        }));

        // Clear draft after applying
        localStorage.removeItem(DRAFT_KEY);
      },

      playNextGame: () => {
        const state = get();
        const nextGame = get().getNextGame();
        
        if (!nextGame) return false;

        const homeRecord = state.league.records[nextGame.homeTeamId];
        const awayRecord = state.league.records[nextGame.awayTeamId];

        const result = simulateGame(
          state.career.player,
          nextGame,
          homeRecord,
          awayRecord,
          state.career.player.attributes,
          state.career.teamId
        );

        set((currentState) => ({
          league: {
            ...currentState.league,
            schedule: currentState.league.schedule.map(game =>
              game.id === nextGame.id ? result.updatedGame : game
            ),
            records: {
              ...currentState.league.records,
              [nextGame.homeTeamId]: {
                ...homeRecord,
                ...result.homeUpdate
              },
              [nextGame.awayTeamId]: {
                ...awayRecord,
                ...result.awayUpdate
              }
            }
          },
          career: {
            ...currentState.career,
            player: {
              ...currentState.career.player,
              energy: Math.max(0, currentState.career.player.energy - 3)
            }
          }
        }));

        return true;
      },

      advanceWeek: (n = 1) => {
        for (let i = 0; i < n; i++) {
          const state = get();
          const nextGame = state.getNextGame();
          if (!nextGame) break;
          
          const homeRecord = state.league.records[nextGame.homeTeamId];
          const awayRecord = state.league.records[nextGame.awayTeamId];

          const result = simulateGame(
            state.career.player,
            nextGame,
            homeRecord,
            awayRecord,
            state.career.player.attributes,
            state.career.teamId
          );

          set((currentState) => ({
            league: {
              ...currentState.league,
              schedule: currentState.league.schedule.map(game =>
                game.id === nextGame.id ? result.updatedGame : game
              ),
              records: {
                ...currentState.league.records,
                [nextGame.homeTeamId]: {
                  ...homeRecord,
                  ...result.homeUpdate
                },
                [nextGame.awayTeamId]: {
                  ...awayRecord,
                  ...result.awayUpdate
                }
              }
            },
            career: {
              ...currentState.career,
              player: {
                ...currentState.career.player,
                energy: Math.max(0, currentState.career.player.energy - 1) // Small energy loss for simming
              }
            }
          }));
        }

        set((state) => {
          let newWeek = state.league.week + n;
          let newYear = state.league.year;

          // Check for season rollover
          if (shouldAdvanceSeason(newWeek, state.league.totalWeeks)) {
            newYear++;
            newWeek = 1;
            
            // Reset records for new season
            const resetRecords: Record<string, TeamRecord> = {};
            state.league.teams.forEach(team => {
              resetRecords[team.id] = {
                teamId: team.id,
                gp: 0,
                w: 0,
                l: 0,
                pf: 0,
                pa: 0
              };
            });

            return {
              league: {
                ...state.league,
                year: newYear,
                week: newWeek,
                records: resetRecords,
                schedule: generateInitialSchedule(state.league.teams, state.league.totalWeeks, state.career.teamId)
              },
              career: {
                ...state.career,
                player: {
                  ...state.career.player,
                  energy: 100 // Restore energy for new season
                }
              }
            };
          }

          return {
            league: {
              ...state.league,
              week: newWeek
            }
          };
        });
      },

      advanceToSeasonEnd: () => {
        const state = get();
        const remainingWeeks = state.league.totalWeeks - state.league.week + 1;
        get().advanceWeek(remainingWeeks);
      },

      toggleAccessoryEquip: (id: string) => {
        set((state) => ({
          career: {
            ...state.career,
            accessories: state.career.accessories.map(acc =>
              acc.id === id ? { ...acc, equipped: !acc.equipped } : acc
            )
          }
        }));
      },

      getNextGame: () => {
        const state = get();
        return state.league.schedule.find(game => 
          !game.played && 
          (game.homeTeamId === state.career.teamId || game.awayTeamId === state.career.teamId)
        ) || null;
      },

      getStandingsByConference: (conference: string) => {
        const state = get();
        const conferenceTeams = state.league.teams.filter(team => team.conference === conference);
        const conferenceRecords = conferenceTeams.reduce((acc, team) => {
          acc[team.id] = state.league.records[team.id];
          return acc;
        }, {} as Record<string, TeamRecord>);
        
        return standingRows(conferenceRecords);
      },

      getCurrentAge: () => {
        const state = get();
        return calculatePlayerAge(state.career.player, state.league.year, state.league.week);
      }
    }),
    {
      name: STORAGE_KEY,
      version: 1
    }
  )
);