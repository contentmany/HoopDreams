import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useSave } from '@/hooks/useSave';
import { ACCESSORIES } from '@/data/accessories';
import { equipAccessory, unequipAccessory, addAccessoryInstance } from '@/state/accessories';
import { saveSave } from '@/state/sim';
import GameHeader from '@/components/GameHeader';
import BottomTabBar from '@/components/BottomTabBar';

export default function Accessories() {
  const saveState = useSave();
  const { toast } = useToast();

  const handleEquip = (instanceId: string) => {
    const updatedSave = equipAccessory(instanceId, saveState);
    saveSave(updatedSave);
    toast({
      title: "Accessory Equipped",
      description: "Accessory equipped successfully"
    });
  };

  const handleUnequip = (instanceId: string) => {
    const updatedSave = unequipAccessory(instanceId, saveState);
    saveSave(updatedSave);
    toast({
      title: "Accessory Unequipped", 
      description: "Accessory unequipped successfully"
    });
  };

  // For demo purposes - add sample accessories
  const handleAddSample = (accessoryId: string) => {
    const updatedSave = addAccessoryInstance(accessoryId, saveState);
    saveSave(updatedSave);
    toast({
      title: "Accessory Added",
      description: "Sample accessory added to inventory"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader />
      <main className="px-4 pt-4 pb-32 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Accessories</h1>
          <p className="text-muted-foreground">Manage your gear and boosts</p>
        </div>

        {/* Owned Accessories */}
        <Card>
          <CardHeader>
            <CardTitle>My Accessories</CardTitle>
          </CardHeader>
          <CardContent>
            {saveState.accessories.length > 0 ? (
              <div className="space-y-3">
                {saveState.accessories.map(instance => {
                  const catalog = ACCESSORIES.find(a => a.id === instance.accessoryId);
                  if (!catalog) return null;
                  
                  return (
                    <div key={instance.instanceId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{catalog.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {catalog.slot}
                          </Badge>
                          {instance.equipped && (
                            <Badge variant="default" className="text-xs">
                              {instance.gamesRemaining} games left
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Boost: {Object.entries(catalog.boost).map(([attr, value]) => 
                            `+${value} ${attr}`
                          ).join(', ')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={instance.equipped ? "outline" : "default"}
                        onClick={() => instance.equipped ? handleUnequip(instance.instanceId) : handleEquip(instance.instanceId)}
                        disabled={instance.equipped && instance.gamesRemaining <= 0}
                        data-testid={`button-${instance.equipped ? 'unequip' : 'equip'}-${instance.instanceId}`}
                      >
                        {instance.equipped ? 'Unequip' : 'Equip'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No accessories yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete games and achievements to earn accessories
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sample Accessories (for demo) */}
        <Card>
          <CardHeader>
            <CardTitle>Available Accessories (Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {ACCESSORIES.map(accessory => (
                <div key={accessory.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{accessory.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {accessory.slot}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {accessory.games} games
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Boost: {Object.entries(accessory.boost).map(([attr, value]) => 
                        `+${value} ${attr}`
                      ).join(', ')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddSample(accessory.id)}
                    data-testid={`button-add-${accessory.id}`}
                  >
                    Add Sample
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <BottomTabBar />
    </div>
  );
}