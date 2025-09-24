import { useState, useEffect } from "react";
import AvatarOrPhoto from "@/components/AvatarOrPhoto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { saveSlots, activeSlot, type SaveSlot } from "@/utils/localStorage";

interface LoadSaveProps {
  onLoadSlot?: (slotId: number) => void;
  onNewGame?: () => void;
  onDeleteSlot?: (slotId: number) => void;
}

export default function LoadSave({ onLoadSlot, onNewGame, onDeleteSlot }: LoadSaveProps) {
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  // No procedural avatar system

  useEffect(() => {
    // Load all save slots
    const allSlots = saveSlots.get();
    setSlots(allSlots);
  }, []);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const handleDelete = (slotId: number) => {
    setShowDeleteConfirm(null);
    saveSlots.delete(slotId);
    // Refresh slots after deletion
    setSlots(saveSlots.get());
    onDeleteSlot?.(slotId);
  };

  const handleLoadSlot = (slotId: number) => {
    activeSlot.set(slotId);
    onLoadSlot?.(slotId);
    // Refresh slots to update lastPlayed
    setSlots(saveSlots.get());
  };

  const handleNewGame = () => {
    onNewGame?.();
    // Refresh slots after potential new game creation
    setTimeout(() => setSlots(saveSlots.get()), 100);
  };

  return (
    <div>
      <main className="px-4 pt-4 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Load / Continue</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {slots.map((slot) => (
              <div key={slot.id} className="border border-border rounded-lg p-4">
                {slot.player ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AvatarOrPhoto size={40} />
                      
                      <div>
                        <h3 className="font-semibold" data-testid={`text-player-name-${slot.id}`}>
                          {slot.player.nameFirst} {slot.player.nameLast}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {slot.player.teamName || 'Team'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {slot.player.position}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Year {slot.player.year} • Week {slot.player.week.toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowDeleteConfirm(slot.id)}
                        data-testid={`button-delete-${slot.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="default" 
                        onClick={() => handleLoadSlot(slot.id)}
                        data-testid={`button-continue-${slot.id}`}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={handleNewGame}
                      data-testid={`button-new-game-${slot.id}`}
                    >
                      <Plus className="w-4 h-4" />
                      New Game
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-sm">
                  <CardHeader>
                    <CardTitle>Delete Save</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Are you sure you want to delete this save? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowDeleteConfirm(null)}
                        data-testid="button-cancel-delete"
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => handleDelete(showDeleteConfirm)}
                        data-testid="button-confirm-delete"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}