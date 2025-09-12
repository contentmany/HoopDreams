// Hoop Dreams Local Storage utilities
import { type CharacterLook } from '@/types/character';

export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface Attributes {
  // Shooting
  close: number;
  mid: number;
  three: number;
  freeThrow: number;
  // Finishing
  drivingLayup: number;
  drivingDunk: number;
  postControl: number;
  // Playmaking
  passAccuracy: number;
  ballHandle: number;
  speedWithBall: number;
  // Defense
  interiorD: number;
  perimeterD: number;
  steal: number;
  block: number;
  oReb: number;
  dReb: number;
  // Physicals
  speed: number;
  acceleration: number;
  strength: number;
  vertical: number;
  stamina: number;
}

export interface Badge {
  id: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'HOF';
}

export interface Milestones {
  threeMade: number;
  assists: number;
  steals: number;
  blocks: number;
  dunks: number;
  stops: number;
  deepThrees: number;
}

export interface Injury {
  type: string;
  weeksRemaining: number;
  description: string;
}

export interface Player {
  nameFirst: string;
  nameLast: string;
  position: string;
  archetype: string;
  heightInches: number;
  heightCm: number;
  teamId: string;
  teamName?: string;
  look: CharacterLook;
  year: number;
  week: number;
  age: number;
  attributes: Attributes;
  badgePoints: number;
  badges: Badge[];
  milestones: Milestones;
  energy: number;
  mood: number;
  clout: number;
  chemistry: number;
  health: number;
  reputation: number;
  seasonCapUsed: number;
  injury?: Injury;
  seasonData?: any; // Will be properly typed when seasonManager is imported
}

export interface SaveSlot {
  id: number;
  player?: Player;
  createdAt: string;
  lastPlayed: string;
}

export interface Settings {
  themeColor: string;
  soundOn: boolean;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Custom';
  seasonLength: 'short' | 'standard';
  units: 'imperial' | 'metric';
}

export interface InboxMessage {
  id: string;
  dateISO: string;
  title: string;
  body: string;
  read: boolean;
  sender: string;
}

// Default teams
export const defaultTeams: Team[] = [
  { id: '1', name: 'Central High Tigers', color: '#7A5BFF' },
  { id: '2', name: 'Westside Prep Eagles', color: '#38E1C6' },
  { id: '3', name: 'Riverside Academy Lions', color: '#FF6B35' },
  { id: '4', name: 'Oak Valley Panthers', color: '#22C55E' },
  { id: '5', name: 'Pine Ridge Wolves', color: '#F59E0B' },
  { id: '6', name: 'Mountain View Hawks', color: '#EF4444' },
  { id: '7', name: 'Valley Tech Rams', color: '#8B5CF6' },
  { id: '8', name: 'East Side Bears', color: '#06B6D4' },
];

// Default settings
export const defaultSettings: Settings = {
  themeColor: '#7A5BFF',
  soundOn: true,
  difficulty: 'Normal',
  seasonLength: 'short',
  units: 'imperial',
};

// Default attributes
export const createDefaultAttributes = (): Attributes => ({
  close: 25, mid: 25, three: 25, freeThrow: 25,
  drivingLayup: 25, drivingDunk: 25, postControl: 25,
  passAccuracy: 25, ballHandle: 25, speedWithBall: 25,
  interiorD: 25, perimeterD: 25, steal: 25, block: 25, oReb: 25, dReb: 25,
  speed: 25, acceleration: 25, strength: 25, vertical: 25, stamina: 25,
});

// Default milestones
export const createDefaultMilestones = (): Milestones => ({
  threeMade: 0, assists: 0, steals: 0, blocks: 0, dunks: 0, stops: 0, deepThrees: 0,
});

// Storage functions
export const saveSlots = {
  get: (): SaveSlot[] => {
    const slots = localStorage.getItem('hd:saveSlots');
    if (!slots) {
      const empty = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        createdAt: '',
        lastPlayed: '',
      }));
      localStorage.setItem('hd:saveSlots', JSON.stringify(empty));
      return empty;
    }
    return JSON.parse(slots);
  },
  
  set: (slots: SaveSlot[]): void => {
    localStorage.setItem('hd:saveSlots', JSON.stringify(slots));
  },
  
  save: (slotId: number, player: Player): void => {
    const slots = saveSlots.get();
    const now = new Date().toISOString();
    slots[slotId - 1] = {
      id: slotId,
      player,
      createdAt: slots[slotId - 1].player ? slots[slotId - 1].createdAt : now,
      lastPlayed: now,
    };
    saveSlots.set(slots);
  },
  
  delete: (slotId: number): void => {
    const slots = saveSlots.get();
    slots[slotId - 1] = {
      id: slotId,
      createdAt: '',
      lastPlayed: '',
    };
    saveSlots.set(slots);
  },
};

export const activeSlot = {
  get: (): number | null => {
    const slot = localStorage.getItem('hd:activeSlot');
    return slot ? parseInt(slot) : null;
  },
  
  set: (slotId: number | null): void => {
    if (slotId === null) {
      localStorage.removeItem('hd:activeSlot');
    } else {
      localStorage.setItem('hd:activeSlot', slotId.toString());
    }
  },
};

export const teams = {
  get: (): Team[] => {
    const stored = localStorage.getItem('hd:teams');
    if (!stored) {
      localStorage.setItem('hd:teams', JSON.stringify(defaultTeams));
      return defaultTeams;
    }
    return JSON.parse(stored);
  },
  
  set: (teamList: Team[]): void => {
    localStorage.setItem('hd:teams', JSON.stringify(teamList));
  },
};

export const settings = {
  get: (): Settings => {
    const stored = localStorage.getItem('hd:settings');
    if (!stored) {
      localStorage.setItem('hd:settings', JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    return { ...defaultSettings, ...JSON.parse(stored) };
  },
  
  set: (newSettings: Partial<Settings>): void => {
    const current = settings.get();
    const updated = { ...current, ...newSettings };
    localStorage.setItem('hd:settings', JSON.stringify(updated));
  },
};

export const player = {
  get: (): Player | null => {
    const currentSlot = activeSlot.get();
    if (!currentSlot) return null;
    
    const slots = saveSlots.get();
    const slot = slots[currentSlot - 1];
    return slot?.player || null;
  },
  
  set: (playerData: Player): void => {
    const currentSlot = activeSlot.get();
    if (!currentSlot) return;
    
    saveSlots.save(currentSlot, playerData);
  },
};

export const inbox = {
  get: (): InboxMessage[] => {
    const stored = localStorage.getItem('hd:inbox');
    return stored ? JSON.parse(stored) : [];
  },
  
  set: (messages: InboxMessage[]): void => {
    localStorage.setItem('hd:inbox', JSON.stringify(messages));
  },
  
  markRead: (messageId: string): void => {
    const messages = inbox.get();
    const message = messages.find(m => m.id === messageId);
    if (message) {
      message.read = true;
      inbox.set(messages);
    }
  },
  
  markAllRead: (): void => {
    const messages = inbox.get().map(m => ({ ...m, read: true }));
    inbox.set(messages);
  },
};

export interface NewsArticle {
  id: string;
  title: string;
  body: string;
  dateISO: string;
  read: boolean;
}

export const news = {
  get: (): NewsArticle[] => {
    const stored = localStorage.getItem('hd:news');
    return stored ? JSON.parse(stored) : [];
  },
  
  set: (articles: NewsArticle[]): void => {
    localStorage.setItem('hd:news', JSON.stringify(articles));
  },
  
  markRead: (articleId: string): void => {
    const articles = news.get();
    const article = articles.find(a => a.id === articleId);
    if (article) {
      article.read = true;
      news.set(articles);
    }
  },
  
  markAllRead: (): void => {
    const articles = news.get().map(a => ({ ...a, read: true }));
    news.set(articles);
  },
};