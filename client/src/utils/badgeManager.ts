import { badges, difficultySettings, type BadgeDefinition } from './gameConfig';
import type { Player, Badge, Attributes, Milestones } from './localStorage';
import { settings } from './localStorage';

export interface AvailableBadge extends BadgeDefinition {
  availableTier: 'Bronze' | 'Silver' | 'Gold' | 'HOF';
  attributeValue: number;
  milestoneValue?: number;
  canUpgrade?: boolean;
  isEquipped: boolean;
}

// Calculate attribute value for badges with calculated requirements
export const calculateBadgeAttributeValue = (badge: BadgeDefinition, player: Player): number => {
  if (badge.attributeKey !== 'calculated') {
    return player.attributes[badge.attributeKey];
  }

  // Handle calculated badges
  switch (badge.id) {
    case 'green-machine':
      return player.attributes.three + ((player.mood || 7) / 10) * 10;
    case 'fearless-finisher':
      return (player.attributes.drivingLayup + player.attributes.strength) / 2;
    case 'putback-boss':
      return (player.attributes.oReb + player.attributes.drivingDunk) / 2;
    case 'unpluckable':
      return (player.attributes.ballHandle + player.attributes.strength) / 2;
    case 'boxout-beast':
      return (player.attributes.strength + player.attributes.dReb) / 2;
    default:
      return 0;
  }
};

// Get all available badges for a player
export const getAvailableBadges = (player: Player): AvailableBadge[] => {
  const currentSettings = settings.get();
  const difficulty = difficultySettings[currentSettings.difficulty];

  const availableBadges: AvailableBadge[] = [];

  badges.forEach(badge => {
    const attributeValue = calculateBadgeAttributeValue(badge, player);
    
    // Apply difficulty scaling to attribute thresholds
    const scaledThresholds = {
      Bronze: Math.round(badge.thresholds.Bronze * difficulty.badgeThresholdScale),
      Silver: Math.round(badge.thresholds.Silver * difficulty.badgeThresholdScale),
      Gold: Math.round(badge.thresholds.Gold * difficulty.badgeThresholdScale),
      HOF: Math.round(badge.thresholds.HOF * difficulty.badgeThresholdScale),
    };

    // Check milestone requirements if applicable
    let milestoneValue: number | undefined = undefined;

    if (badge.milestoneKey && badge.milestoneThresholds) {
      milestoneValue = player.milestones[badge.milestoneKey];
      
      const scaledMilestoneThresholds = {
        Bronze: Math.round(badge.milestoneThresholds.Bronze * difficulty.milestoneScale),
        Silver: Math.round(badge.milestoneThresholds.Silver * difficulty.milestoneScale),
        Gold: Math.round(badge.milestoneThresholds.Gold * difficulty.milestoneScale),
        HOF: Math.round(badge.milestoneThresholds.HOF * difficulty.milestoneScale),
      };

      // Determine highest tier available
      let availableTier: 'Bronze' | 'Silver' | 'Gold' | 'HOF' | null = null;
      
      if (attributeValue >= scaledThresholds.HOF && milestoneValue >= scaledMilestoneThresholds.HOF) {
        availableTier = 'HOF';
      } else if (attributeValue >= scaledThresholds.Gold && milestoneValue >= scaledMilestoneThresholds.Gold) {
        availableTier = 'Gold';
      } else if (attributeValue >= scaledThresholds.Silver && milestoneValue >= scaledMilestoneThresholds.Silver) {
        availableTier = 'Silver';
      } else if (attributeValue >= scaledThresholds.Bronze && milestoneValue >= scaledMilestoneThresholds.Bronze) {
        availableTier = 'Bronze';
      }

      if (availableTier) {
        const currentBadge = player.badges.find(b => b.id === badge.id);
        const isEquipped = !!currentBadge;
        const canUpgrade = currentBadge && getTierLevel(availableTier) > getTierLevel(currentBadge.tier);

        availableBadges.push({
          ...badge,
          availableTier,
          attributeValue,
          milestoneValue,
          canUpgrade: canUpgrade || false,
          isEquipped,
        });
      }
    } else {
      // Attribute-only badges
      let availableTier: 'Bronze' | 'Silver' | 'Gold' | 'HOF' | null = null;
      
      if (attributeValue >= scaledThresholds.HOF) availableTier = 'HOF';
      else if (attributeValue >= scaledThresholds.Gold) availableTier = 'Gold';
      else if (attributeValue >= scaledThresholds.Silver) availableTier = 'Silver';
      else if (attributeValue >= scaledThresholds.Bronze) availableTier = 'Bronze';
      
      if (availableTier) {
        const currentBadge = player.badges.find(b => b.id === badge.id);
        const isEquipped = !!currentBadge;
        const canUpgrade = currentBadge && getTierLevel(availableTier) > getTierLevel(currentBadge.tier);

        availableBadges.push({
          ...badge,
          availableTier,
          attributeValue,
          canUpgrade: canUpgrade || false,
          isEquipped,
        });
      }
    }
  });

  return availableBadges;
};

// Get tier level for comparison
export const getTierLevel = (tier: 'Bronze' | 'Silver' | 'Gold' | 'HOF'): number => {
  switch (tier) {
    case 'Bronze': return 1;
    case 'Silver': return 2;
    case 'Gold': return 3;
    case 'HOF': return 4;
    default: return 0;
  }
};

// Get badge point cost for equipping a badge
export const getBadgePointCost = (tier: 'Bronze' | 'Silver' | 'Gold' | 'HOF'): number => {
  switch (tier) {
    case 'Bronze': return 1;
    case 'Silver': return 2;
    case 'Gold': return 3;
    case 'HOF': return 4;
    default: return 0;
  }
};

// Check if player can equip a badge
export const canEquipBadge = (player: Player, badgeId: string, tier: 'Bronze' | 'Silver' | 'Gold' | 'HOF'): boolean => {
  const cost = getBadgePointCost(tier);
  const currentBadge = player.badges.find(b => b.id === badgeId);
  
  // First check if the player actually qualifies for this tier
  const availableBadges = getAvailableBadges(player);
  const badgeAvailability = availableBadges.find(b => b.id === badgeId);
  
  if (!badgeAvailability || getTierLevel(tier) > getTierLevel(badgeAvailability.availableTier)) {
    return false; // Player doesn't qualify for this tier
  }
  
  if (currentBadge) {
    // Only allow upgrades, not downgrades
    if (getTierLevel(tier) <= getTierLevel(currentBadge.tier)) {
      return false;
    }
    // Upgrading existing badge
    const currentCost = getBadgePointCost(currentBadge.tier);
    const additionalCost = cost - currentCost;
    return player.badgePoints >= additionalCost;
  } else {
    // New badge
    return player.badgePoints >= cost;
  }
};

// Equip or upgrade a badge
export const equipBadge = (player: Player, badgeId: string, tier: 'Bronze' | 'Silver' | 'Gold' | 'HOF'): Player => {
  if (!canEquipBadge(player, badgeId, tier)) {
    throw new Error('Insufficient badge points');
  }

  const cost = getBadgePointCost(tier);
  const currentBadgeIndex = player.badges.findIndex(b => b.id === badgeId);
  
  const updatedPlayer = { ...player };

  if (currentBadgeIndex >= 0) {
    // Upgrading existing badge
    const currentCost = getBadgePointCost(player.badges[currentBadgeIndex].tier);
    const additionalCost = cost - currentCost;
    
    updatedPlayer.badges[currentBadgeIndex] = { id: badgeId, tier };
    updatedPlayer.badgePoints -= additionalCost;
  } else {
    // Equipping new badge
    updatedPlayer.badges = [...player.badges, { id: badgeId, tier }];
    updatedPlayer.badgePoints -= cost;
  }

  return updatedPlayer;
};

// Unequip a badge
export const unequipBadge = (player: Player, badgeId: string): Player => {
  const badgeIndex = player.badges.findIndex(b => b.id === badgeId);
  
  if (badgeIndex === -1) {
    throw new Error('Badge not equipped');
  }

  const badge = player.badges[badgeIndex];
  const refund = getBadgePointCost(badge.tier);

  return {
    ...player,
    badges: player.badges.filter(b => b.id !== badgeId),
    badgePoints: player.badgePoints + refund,
  };
};

// Get badge by category
export const getBadgesByCategory = (availableBadges: AvailableBadge[]): Record<string, AvailableBadge[]> => {
  return availableBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, AvailableBadge[]>);
};

// Update milestones based on game performance
export const updateMilestones = (player: Player, gameStats: Record<string, number>): Player => {
  const updatedMilestones: Milestones = { ...player.milestones };

  if (gameStats.threeMade) updatedMilestones.threeMade += gameStats.threeMade;
  if (gameStats.assists) updatedMilestones.assists += gameStats.assists;
  if (gameStats.steals) updatedMilestones.steals += gameStats.steals;
  if (gameStats.blocks) updatedMilestones.blocks += gameStats.blocks;
  if (gameStats.dunks) updatedMilestones.dunks += gameStats.dunks;
  if (gameStats.stops) updatedMilestones.stops += gameStats.stops;
  if (gameStats.deepThrees) updatedMilestones.deepThrees += gameStats.deepThrees;

  return {
    ...player,
    milestones: updatedMilestones,
  };
};