import { AccessoryInstance, Accessory } from '@/types/accessories';
import { ACCESSORIES } from '@/data/accessories';
import type { SaveState } from '@/state/sim';

export function equipAccessory(instanceId: string, saveState: SaveState): SaveState {
  return {
    ...saveState,
    accessories: saveState.accessories.map(acc => {
      if (acc.instanceId === instanceId) {
        const catalog = ACCESSORIES.find(a => a.id === acc.accessoryId);
        return {
          ...acc,
          equipped: true,
          gamesRemaining: catalog?.games || 0
        };
      }
      return acc;
    })
  };
}

export function unequipAccessory(instanceId: string, saveState: SaveState): SaveState {
  return {
    ...saveState,
    accessories: saveState.accessories.map(acc =>
      acc.instanceId === instanceId 
        ? { ...acc, equipped: false }
        : acc
    )
  };
}

export function applyAccessoryBoosts(baseAttributes: Record<string, number>, saveState: SaveState): Record<string, number> {
  const boostedAttributes = { ...baseAttributes };
  
  // Find all equipped accessories
  const equippedAccessories = saveState.accessories
    .filter(instance => instance.equipped && instance.gamesRemaining > 0)
    .map(instance => {
      const catalog = ACCESSORIES.find(a => a.id === instance.accessoryId);
      return { instance, catalog };
    })
    .filter(({ catalog }) => catalog !== undefined);

  // Apply boosts
  equippedAccessories.forEach(({ catalog }) => {
    if (catalog) {
      Object.entries(catalog.boost).forEach(([attr, boost]) => {
        if (boostedAttributes[attr] !== undefined) {
          boostedAttributes[attr] += boost;
        }
      });
    }
  });

  return boostedAttributes;
}

export function onGameResolved(saveState: SaveState): SaveState {
  return {
    ...saveState,
    accessories: saveState.accessories.map(acc => {
      if (acc.equipped && acc.gamesRemaining > 0) {
        const newGamesRemaining = acc.gamesRemaining - 1;
        return {
          ...acc,
          gamesRemaining: newGamesRemaining,
          equipped: newGamesRemaining > 0 // Auto-unequip when games reach 0
        };
      }
      return acc;
    })
  };
}

export function addAccessoryInstance(accessoryId: string, saveState: SaveState): SaveState {
  const newInstance: AccessoryInstance = {
    instanceId: `${accessoryId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    accessoryId,
    equipped: false,
    gamesRemaining: 0,
    acquiredISO: new Date().toISOString()
  };

  return {
    ...saveState,
    accessories: [...saveState.accessories, newInstance]
  };
}