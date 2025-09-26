import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BackLink from '@/components/BackLink';
import { useGameStore } from '@/state/gameStore';

export default function Accessories() {
  const { career, toggleAccessoryEquip } = useGameStore();
  const { accessories } = career;

  const equippedAccessories = accessories.filter(acc => acc.equipped);
  const unequippedAccessories = accessories.filter(acc => acc.owned && !acc.equipped);

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <BackLink />
          <div>
            <h1 className="text-2xl font-bold text-primary">Accessories</h1>
            <p className="text-sm text-muted-foreground">Manage your gear</p>
          </div>
        </div>

        {/* Equipped Items */}
        <Card>
          <CardHeader>
            <CardTitle>Equipped</CardTitle>
          </CardHeader>
          <CardContent>
            {equippedAccessories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {equippedAccessories.map((accessory) => (
                  <div 
                    key={accessory.id}
                    className="p-4 border rounded-lg bg-green-50 dark:bg-green-950"
                    data-testid={`equipped-${accessory.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{accessory.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {accessory.slot}
                        </Badge>
                        
                        {/* Stat Boosts */}
                        <div className="mt-2 space-y-1 text-sm">
                          {Object.entries(accessory.boost).map(([stat, boost]) => (
                            <div key={stat} className="text-green-600 dark:text-green-400">
                              +{boost} {stat}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          {accessory.durationGames} games remaining
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAccessoryEquip(accessory.id)}
                        data-testid={`unequip-${accessory.id}`}
                      >
                        Unequip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No accessories equipped.</p>
                <p className="text-sm mt-1">Equip items from your inventory below.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            {unequippedAccessories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {unequippedAccessories.map((accessory) => (
                  <div 
                    key={accessory.id}
                    className="p-4 border rounded-lg"
                    data-testid={`inventory-${accessory.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{accessory.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {accessory.slot}
                        </Badge>
                        
                        {/* Stat Boosts */}
                        <div className="mt-2 space-y-1 text-sm">
                          {Object.entries(accessory.boost).map(([stat, boost]) => (
                            <div key={stat} className="text-blue-600 dark:text-blue-400">
                              +{boost} {stat}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          {accessory.durationGames} games duration
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => toggleAccessoryEquip(accessory.id)}
                        data-testid={`equip-${accessory.id}`}
                      >
                        Equip
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <div className="space-y-3">
                  <div className="text-6xl">🎒</div>
                  <div>
                    <p className="text-lg font-medium">No accessories yet</p>
                    <p className="text-sm mt-1">Buy items in the Shop to boost your performance.</p>
                    <p className="text-sm">Equipped items will provide stat boosts during games.</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>About Accessories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Accessories provide temporary stat boosts during games. Each item has a limited duration 
              and will wear out after being used in the specified number of games.
            </p>
            <p>
              Different slots allow you to equip multiple accessories at once:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Wrist:</strong> Shooting and ball-handling boosts</li>
              <li><strong>Sleeve:</strong> Arm protection and shooting accuracy</li>
              <li><strong>Headband:</strong> Mental focus and endurance</li>
              <li><strong>Shoes:</strong> Speed and jumping improvements</li>
              <li><strong>Misc:</strong> Various performance enhancements</li>
            </ul>
            <p className="text-xs mt-4 p-3 bg-muted rounded-lg">
              <strong>Coming Soon:</strong> Shop integration will allow you to purchase new accessories 
              with earned points from games and achievements.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}