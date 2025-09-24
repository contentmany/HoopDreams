import { useSyncExternalStore } from "react";

export type PlayerId = string;
export type Player = {
  id: PlayerId;
  name: string;
  position: "PG"|"SG"|"SF"|"PF"|"C";
  overall: number;
  cash: number;
  energy: number;
  reputation: number;
  team?: string;
  avatarDataUrl?: string; // photo avatar
  businesses?: { name: string; incomePerWeek: number }[];
};
export type SaveState = {
  current?: PlayerId;
  players: Record<PlayerId, Player>;
};

const KEY = "hoopdreams:save";
let cache: SaveState = { players: {} };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(l => l());

function readStorage(): SaveState {
  if (typeof window === "undefined" || !window.localStorage) {
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      cache = { players: {} };
      return cache;
    }
    const parsed = JSON.parse(raw) as SaveState;
    cache = { current: parsed.current, players: parsed.players ?? {} };
  } catch {
    cache = { players: {} };
  }
  return cache;
}

function writeStorage(state: SaveState) {
  cache = { current: state.current, players: { ...state.players } };
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(cache));
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }
  emit();
}

export const Store = {
  load(): SaveState {
    return readStorage();
  },
  save(state: SaveState){
    writeStorage(state);
  },
  upsert(p: Player){
    const s = this.load();
    s.players = { ...s.players, [p.id]: p };
    s.current = p.id;
    this.save(s);
  },
  all(): Player[]{
    const s = this.load();
    return Object.values(s.players ?? {});
  },
  current(): Player | undefined {
    const s = this.load();
    return s.current ? s.players[s.current] : undefined;
  },
  setCurrent(id?: PlayerId){
    const s = this.load();
    s.current = id;
    this.save(s);
  },
  remove(id: PlayerId){
    const s = this.load();
    delete s.players[id];
    if (s.current === id) s.current = undefined;
    this.save(s);
  },
  subscribe(listener: () => void){
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};

// tiny sim helpers
export function simTick(mode:"week"|"month"|"season"){
  const p=Store.current(); if(!p) return;
  const mult = mode==="week"?1:mode==="month"?4:20;
  const updated: Player = {
    ...p,
    overall: Math.min(99, p.overall + Math.floor(Math.random()*(1+mult))),
    energy: Math.max(0, p.energy - Math.floor(Math.random()*(6+mult))),
    cash: p.cash + Math.floor((p.businesses?.reduce((a,b)=>a+b.incomePerWeek,0)??300)*mult),
    reputation: Math.min(100, p.reputation + Math.floor(Math.random()*2))
  };
  Store.upsert(updated);
}

export function useCurrentPlayer(){
  return useSyncExternalStore(Store.subscribe, () => Store.current());
}

export function useAllPlayers(){
  return useSyncExternalStore(Store.subscribe, () => Store.all());
}
