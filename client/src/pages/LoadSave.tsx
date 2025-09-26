 feat/photo-avatar
import { useState, useEffect } from "react";
import AvatarOrPhoto from "@/components/AvatarOrPhoto";

 main
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGameStore } from "@/state/gameStore";
import { useLocation } from "wouter";
import AvatarPhoto from "@/components/AvatarPhoto";

export default function LoadSave() {
  const [, setLocation] = useLocation();
  const { hasValidPlayer } = useGameStore();

 feat/photo-avatar
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

  const handleLoadExistingGame = () => {
    if (hasValidPlayer()) {
      setLocation('/home');
    }
 main
  };

  const handleNewGame = () => {
    setLocation('/new');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Hoop Dreams</h1>
          <p className="text-muted-foreground">Basketball Life Simulator</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Load / Continue</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
 feat/photo-avatar
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

            {hasValidPlayer() ? (
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AvatarPhoto size={40} />
                    <div>
                      <h3 className="font-semibold" data-testid="text-existing-player">
                        Your Career
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Continue your basketball journey
                      </p>
 main
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleLoadExistingGame}
                    data-testid="button-continue-career"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="font-medium">Start New Career</span>
                      <p className="text-xs text-muted-foreground">
                        Create your basketball player
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleNewGame}
                    data-testid="button-new-game"
                  >
                    New Game
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}