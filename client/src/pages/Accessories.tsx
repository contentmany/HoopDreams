import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BackLink from '@/components/BackLink';
import { loadSave, saveSave, type AccessoryInstance } from '@/state/sim';

export default function Accessories() {
  const saveState = loadSave();
  const equippedAccessories = saveState?.accessories || [];
  
  const handleRemoveExpired = (accessoryId: string) => {
    if (!saveState) return;
    
    const updatedAccessories = saveState.accessories.filter(acc => acc.id !== accessoryId);
    const updatedSave = { ...saveState, accessories: updatedAccessories };
    saveSave(updatedSave);
    
    // Refresh page
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <BackLink className="text-primary hover:text-primary/80 transition-colors">
            ← Back
          </BackLink>
          <h1 className="text-3xl font-bold">Accessories</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Equipped Items</CardTitle>
          </CardHeader>
          <CardContent>
            {equippedAccessories.length > 0 ? (
              <div className="space-y-4">
                {equippedAccessories.map((accessory, index) => (
                  <div key={`${accessory.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{accessory.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        +{accessory.boost.amount} {accessory.boost.attr}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant={accessory.gamesRemaining > 0 ? "default" : "secondary"}>
                          {accessory.gamesRemaining > 0 
                            ? `${accessory.gamesRemaining} games left`
                            : "Expired"
                          }
                        </Badge>
                      </div>
                    </div>
                    {accessory.gamesRemaining === 0 && (
                      <Button
                        onClick={() => handleRemoveExpired(accessory.id)}
                        variant="outline"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>No accessories yet</p>
                <p className="text-sm">Items that boost your stats will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Shop</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              <p>Shop coming soon</p>
              <p className="text-sm">Purchase items to boost your performance</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}