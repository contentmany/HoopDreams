import type { Attributes } from './localStorage';

// Position-based archetypes
export const archetypesByPosition = {
  PG: ['Pass First', 'Shot Creator', '3-Point Playmaker', 'Two-Way Playmaker'],
  SG: ['Sharpshooter', 'Slasher', '3-and-D Guard', 'Two-Way Scorer'],
  SF: ['Point Forward', '3-and-D Wing', 'Slashing Wing', 'Two-Way Wing'],
  PF: ['Stretch Four', 'Glass-Cleaning Finisher', 'Two-Way Stretch', 'Inside-Out Four'],
  C: ['Paint Beast', 'Stretch Five', 'Two-Way Interior', 'Mobile Big'],
};

// Height ranges by position (in inches)
export const heightRanges = {
  PG: { min: 69, max: 77 }, // 5'9" - 6'5"
  SG: { min: 74, max: 80 }, // 6'2" - 6'8"
  SF: { min: 77, max: 82 }, // 6'5" - 6'10"
  PF: { min: 79, max: 83 }, // 6'7" - 6'11"
  C: { min: 81, max: 87 },  // 6'9" - 7'3"
};

// Height categories for attribute caps
export const getHeightCategory = (position: string, heightInches: number): 'short' | 'avg' | 'tall' => {
  const range = heightRanges[position as keyof typeof heightRanges];
  if (!range) return 'avg';
  
  const rangeSize = range.max - range.min;
  const third = rangeSize / 3;
  
  if (heightInches < range.min + third) return 'short';
  if (heightInches > range.max - third) return 'tall';
  return 'avg';
};

// Attribute caps by position and height
export const getAttributeCaps = (position: string, heightInches: number): Partial<Attributes> => {
  const heightCat = getHeightCategory(position, heightInches);
  
  const baseCaps: Record<string, Partial<Attributes>> = {
    PG: {
      // Shooting
      close: 95, mid: 95, three: 95, freeThrow: 95,
      // Finishing
      drivingLayup: 95, drivingDunk: 85, postControl: 70,
      // Playmaking
      passAccuracy: 95, ballHandle: 95, speedWithBall: 95,
      // Defense
      interiorD: 70, perimeterD: 90, steal: 95, block: 60, oReb: 75, dReb: 80,
      // Physicals
      speed: 95, acceleration: 95, strength: 75, vertical: 90, stamina: 95,
    },
    SG: {
      // Shooting
      close: 90, mid: 95, three: 95, freeThrow: 90,
      // Finishing
      drivingLayup: 90, drivingDunk: 90, postControl: 75,
      // Playmaking
      passAccuracy: 85, ballHandle: 90, speedWithBall: 90,
      // Defense
      interiorD: 75, perimeterD: 95, steal: 90, block: 70, oReb: 80, dReb: 85,
      // Physicals
      speed: 90, acceleration: 90, strength: 80, vertical: 95, stamina: 90,
    },
    SF: {
      // Shooting
      close: 85, mid: 90, three: 90, freeThrow: 85,
      // Finishing
      drivingLayup: 85, drivingDunk: 90, postControl: 80,
      // Playmaking
      passAccuracy: 80, ballHandle: 85, speedWithBall: 85,
      // Defense
      interiorD: 80, perimeterD: 90, steal: 85, block: 80, oReb: 85, dReb: 90,
      // Physicals
      speed: 85, acceleration: 85, strength: 85, vertical: 90, stamina: 85,
    },
    PF: {
      // Shooting
      close: 80, mid: 85, three: 80, freeThrow: 80,
      // Finishing
      drivingLayup: 80, drivingDunk: 95, postControl: 90,
      // Playmaking
      passAccuracy: 75, ballHandle: 70, speedWithBall: 70,
      // Defense
      interiorD: 90, perimeterD: 80, steal: 75, block: 90, oReb: 95, dReb: 95,
      // Physicals
      speed: 75, acceleration: 75, strength: 95, vertical: 85, stamina: 80,
    },
    C: {
      // Shooting
      close: 95, mid: 75, three: 70, freeThrow: 75,
      // Finishing
      drivingLayup: 75, drivingDunk: 95, postControl: 95,
      // Playmaking
      passAccuracy: 70, ballHandle: 60, speedWithBall: 60,
      // Defense
      interiorD: 95, perimeterD: 70, steal: 70, block: 95, oReb: 95, dReb: 95,
      // Physicals
      speed: 70, acceleration: 70, strength: 95, vertical: 80, stamina: 75,
    },
  };

  const caps = baseCaps[position] || baseCaps.SF;
  
  // Height modifiers
  const heightModifiers: Record<string, Partial<Attributes>> = {
    short: {
      three: (caps.three || 70) + 5,
      speed: (caps.speed || 70) + 5,
      acceleration: (caps.acceleration || 70) + 5,
      ballHandle: (caps.ballHandle || 70) + 5,
      steal: (caps.steal || 70) + 5,
      block: Math.max((caps.block || 70) - 10, 50),
      strength: Math.max((caps.strength || 70) - 5, 50),
    },
    tall: {
      block: (caps.block || 70) + 10,
      strength: (caps.strength || 70) + 5,
      interiorD: (caps.interiorD || 70) + 5,
      dReb: (caps.dReb || 70) + 5,
      three: Math.max((caps.three || 70) - 5, 50),
      speed: Math.max((caps.speed || 70) - 5, 50),
    },
    avg: {},
  };

  const modifier = heightModifiers[heightCat];
  return { ...caps, ...modifier };
};

// OVR weights by position
export const getOVRWeights = (position: string): Partial<Attributes> => {
  const weights: Record<string, Partial<Attributes>> = {
    PG: {
      // Shooting
      close: 3, mid: 4, three: 5, freeThrow: 2,
      // Finishing
      drivingLayup: 4, drivingDunk: 2, postControl: 1,
      // Playmaking
      passAccuracy: 8, ballHandle: 7, speedWithBall: 6,
      // Defense
      interiorD: 2, perimeterD: 5, steal: 4, block: 1, oReb: 2, dReb: 3,
      // Physicals
      speed: 6, acceleration: 5, strength: 3, vertical: 3, stamina: 4,
    },
    SG: {
      // Shooting
      close: 4, mid: 6, three: 7, freeThrow: 3,
      // Finishing
      drivingLayup: 5, drivingDunk: 4, postControl: 2,
      // Playmaking
      passAccuracy: 4, ballHandle: 5, speedWithBall: 5,
      // Defense
      interiorD: 3, perimeterD: 6, steal: 4, block: 2, oReb: 3, dReb: 4,
      // Physicals
      speed: 5, acceleration: 5, strength: 4, vertical: 5, stamina: 5,
    },
    SF: {
      // Shooting
      close: 4, mid: 5, three: 5, freeThrow: 2,
      // Finishing
      drivingLayup: 4, drivingDunk: 4, postControl: 3,
      // Playmaking
      passAccuracy: 5, ballHandle: 4, speedWithBall: 4,
      // Defense
      interiorD: 4, perimeterD: 5, steal: 4, block: 4, oReb: 4, dReb: 5,
      // Physicals
      speed: 5, acceleration: 5, strength: 5, vertical: 5, stamina: 5,
    },
    PF: {
      // Shooting
      close: 5, mid: 4, three: 3, freeThrow: 2,
      // Finishing
      drivingLayup: 4, drivingDunk: 6, postControl: 5,
      // Playmaking
      passAccuracy: 3, ballHandle: 2, speedWithBall: 2,
      // Defense
      interiorD: 6, perimeterD: 4, steal: 3, block: 6, oReb: 6, dReb: 7,
      // Physicals
      speed: 3, acceleration: 3, strength: 6, vertical: 4, stamina: 4,
    },
    C: {
      // Shooting
      close: 6, mid: 3, three: 2, freeThrow: 2,
      // Finishing
      drivingLayup: 3, drivingDunk: 7, postControl: 6,
      // Playmaking
      passAccuracy: 2, ballHandle: 1, speedWithBall: 1,
      // Defense
      interiorD: 8, perimeterD: 3, steal: 2, block: 8, oReb: 7, dReb: 8,
      // Physicals
      speed: 2, acceleration: 2, strength: 7, vertical: 3, stamina: 3,
    },
  };

  return weights[position] || weights.SF;
};

// Calculate OVR from attributes
export const calculateOVR = (attributes: Attributes, position: string): number => {
  const weights = getOVRWeights(position);
  let totalWeighted = 0;
  let totalWeight = 0;

  Object.entries(weights).forEach(([attr, weight]) => {
    const value = attributes[attr as keyof Attributes];
    totalWeighted += value * weight;
    totalWeight += weight;
  });

  return Math.round(totalWeighted / totalWeight);
};

// Difficulty settings
export const difficultySettings = {
  Easy: {
    startingPoints: 280,
    trainingReturn: 0.7,
    badgeThresholdScale: 0.95,
    milestoneScale: 0.85,
    injuryChance: 0.8,
    gameEnergyCost: 3,
    trainEnergyCost: 2,
    opponentStrength: -3,
    startingBadgePoints: 4,
  },
  Normal: {
    startingPoints: 250,
    trainingReturn: 0.5,
    badgeThresholdScale: 1.0,
    milestoneScale: 1.0,
    injuryChance: 1.0,
    gameEnergyCost: 3,
    trainEnergyCost: 3,
    opponentStrength: 0,
    startingBadgePoints: 3,
  },
  Hard: {
    startingPoints: 220,
    trainingReturn: 0.35,
    badgeThresholdScale: 1.05,
    milestoneScale: 1.15,
    injuryChance: 1.2,
    gameEnergyCost: 3,
    trainEnergyCost: 4,
    opponentStrength: 3,
    startingBadgePoints: 2,
  },
  Custom: {
    startingPoints: 250,
    trainingReturn: 0.5,
    badgeThresholdScale: 1.0,
    milestoneScale: 1.0,
    injuryChance: 1.0,
    gameEnergyCost: 3,
    trainEnergyCost: 3,
    opponentStrength: 0,
    startingBadgePoints: 3,
  },
};

// Badge definitions
export interface BadgeDefinition {
  id: string;
  name: string;
  category: 'SHOOTING' | 'FINISHING' | 'PLAYMAKING' | 'DEFENSE';
  description: string;
  thresholds: {
    Bronze: number;
    Silver: number;
    Gold: number;
    HOF: number;
  };
  attributeKey: keyof Attributes | 'calculated';
  milestoneKey?: keyof import('./localStorage').Milestones;
  milestoneThresholds?: {
    Bronze: number;
    Silver: number;
    Gold: number;
    HOF: number;
  };
}

export const badges: BadgeDefinition[] = [
  // SHOOTING
  {
    id: 'catch-shoot',
    name: 'Catch & Shoot',
    category: 'SHOOTING',
    description: 'Boost to shooting off the catch',
    thresholds: { Bronze: 72, Silver: 80, Gold: 88, HOF: 95 },
    attributeKey: 'three',
    milestoneKey: 'threeMade',
    milestoneThresholds: { Bronze: 50, Silver: 120, Gold: 220, HOF: 360 },
  },
  {
    id: 'deadeye',
    name: 'Deadeye',
    category: 'SHOOTING',
    description: 'Reduces the impact of a defender closing out',
    thresholds: { Bronze: 75, Silver: 83, Gold: 90, HOF: 96 },
    attributeKey: 'three',
    milestoneKey: 'threeMade',
    milestoneThresholds: { Bronze: 50, Silver: 120, Gold: 220, HOF: 360 },
  },
  {
    id: 'limitless-range',
    name: 'Limitless Range',
    category: 'SHOOTING',
    description: 'Extends the range from which a player can effectively shoot',
    thresholds: { Bronze: 78, Silver: 86, Gold: 92, HOF: 97 },
    attributeKey: 'three',
    milestoneKey: 'deepThrees',
    milestoneThresholds: { Bronze: 40, Silver: 100, Gold: 180, HOF: 300 },
  },
  {
    id: 'corner-specialist',
    name: 'Corner Specialist',
    category: 'SHOOTING',
    description: 'Boosts ability to shoot from the corners',
    thresholds: { Bronze: 70, Silver: 78, Gold: 86, HOF: 92 },
    attributeKey: 'three',
  },
  {
    id: 'green-machine',
    name: 'Green Machine',
    category: 'SHOOTING',
    description: 'Increases shooting attributes when on a hot streak',
    thresholds: { Bronze: 72, Silver: 80, Gold: 88, HOF: 95 },
    attributeKey: 'calculated', // three + mood/10
  },
  
  // FINISHING
  {
    id: 'acrobat',
    name: 'Acrobat',
    category: 'FINISHING',
    description: 'Boosts the ability to hit difficult layups',
    thresholds: { Bronze: 74, Silver: 82, Gold: 90, HOF: 96 },
    attributeKey: 'drivingLayup',
  },
  {
    id: 'slithery',
    name: 'Slithery',
    category: 'FINISHING',
    description: 'Improves a player\'s ability to avoid contact',
    thresholds: { Bronze: 76, Silver: 84, Gold: 90, HOF: 96 },
    attributeKey: 'drivingLayup',
  },
  {
    id: 'posterizer',
    name: 'Posterizer',
    category: 'FINISHING',
    description: 'Improves the chances of successfully dunking on opponents',
    thresholds: { Bronze: 80, Silver: 87, Gold: 93, HOF: 97 },
    attributeKey: 'drivingDunk',
    milestoneKey: 'dunks',
    milestoneThresholds: { Bronze: 40, Silver: 90, Gold: 160, HOF: 240 },
  },
  {
    id: 'fearless-finisher',
    name: 'Fearless Finisher',
    category: 'FINISHING',
    description: 'Boosts finishing through contact near the rim',
    thresholds: { Bronze: 72, Silver: 80, Gold: 88, HOF: 94 },
    attributeKey: 'calculated', // (drivingLayup + strength) / 2
  },
  {
    id: 'putback-boss',
    name: 'Putback Boss',
    category: 'FINISHING',
    description: 'Improves putback dunks and standing dunks',
    thresholds: { Bronze: 72, Silver: 80, Gold: 88, HOF: 94 },
    attributeKey: 'calculated', // (oReb + drivingDunk) / 2
  },
  
  // PLAYMAKING
  {
    id: 'dimer',
    name: 'Dimer',
    category: 'PLAYMAKING',
    description: 'Boosts shooting attributes of open teammates on catches',
    thresholds: { Bronze: 76, Silver: 84, Gold: 90, HOF: 95 },
    attributeKey: 'passAccuracy',
    milestoneKey: 'assists',
    milestoneThresholds: { Bronze: 100, Silver: 240, Gold: 420, HOF: 600 },
  },
  {
    id: 'quick-first-step',
    name: 'Quick First Step',
    category: 'PLAYMAKING',
    description: 'Provides more explosive first steps out of the triple threat',
    thresholds: { Bronze: 78, Silver: 86, Gold: 92, HOF: 97 },
    attributeKey: 'speedWithBall',
  },
  {
    id: 'handles-for-days',
    name: 'Handles for Days',
    category: 'PLAYMAKING',
    description: 'Reduces the energy lost when dribbling',
    thresholds: { Bronze: 79, Silver: 86, Gold: 92, HOF: 97 },
    attributeKey: 'ballHandle',
  },
  {
    id: 'unpluckable',
    name: 'Unpluckable',
    category: 'PLAYMAKING',
    description: 'Reduces the chances of getting stripped',
    thresholds: { Bronze: 74, Silver: 82, Gold: 90, HOF: 95 },
    attributeKey: 'calculated', // (ballHandle + strength) / 2
  },
  {
    id: 'needle-threader',
    name: 'Needle Threader',
    category: 'PLAYMAKING',
    description: 'Increases the success of passes through tight windows',
    thresholds: { Bronze: 78, Silver: 86, Gold: 92, HOF: 97 },
    attributeKey: 'passAccuracy',
  },
  
  // DEFENSE/REBOUNDING
  {
    id: 'clamps',
    name: 'Clamps',
    category: 'DEFENSE',
    description: 'Improves the ability to stay in front of the ball handler',
    thresholds: { Bronze: 78, Silver: 86, Gold: 92, HOF: 97 },
    attributeKey: 'perimeterD',
    milestoneKey: 'stops',
    milestoneThresholds: { Bronze: 60, Silver: 130, Gold: 220, HOF: 360 },
  },
  {
    id: 'interceptor',
    name: 'Interceptor',
    category: 'DEFENSE',
    description: 'Improves the chances of stealing the ball',
    thresholds: { Bronze: 75, Silver: 83, Gold: 90, HOF: 96 },
    attributeKey: 'steal',
    milestoneKey: 'steals',
    milestoneThresholds: { Bronze: 60, Silver: 130, Gold: 220, HOF: 360 },
  },
  {
    id: 'rim-protector',
    name: 'Rim Protector',
    category: 'DEFENSE',
    description: 'Boosts shot blocking and intimidation around the rim',
    thresholds: { Bronze: 78, Silver: 86, Gold: 92, HOF: 97 },
    attributeKey: 'block',
    milestoneKey: 'blocks',
    milestoneThresholds: { Bronze: 60, Silver: 130, Gold: 220, HOF: 360 },
  },
  {
    id: 'boxout-beast',
    name: 'Boxout Beast',
    category: 'DEFENSE',
    description: 'Improves the effectiveness of boxing out opponents',
    thresholds: { Bronze: 74, Silver: 82, Gold: 90, HOF: 95 },
    attributeKey: 'calculated', // (strength + dReb) / 2
  },
  {
    id: 'anchor',
    name: 'Anchor',
    category: 'DEFENSE',
    description: 'Boosts the ability to defend the paint',
    thresholds: { Bronze: 80, Silver: 87, Gold: 93, HOF: 97 },
    attributeKey: 'interiorD',
  },
];

// Utility functions
export const inchesToFeetInches = (inches: number): string => {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
};

export const inchesToCm = (inches: number): number => {
  return Math.round(inches * 2.54);
};

export const cmToInches = (cm: number): number => {
  return Math.round(cm / 2.54);
};

export const feetInchesToInches = (feet: number, inches: number): number => {
  return feet * 12 + inches;
};