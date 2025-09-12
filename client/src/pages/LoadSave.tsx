import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import CharacterPreview from "@/components/CharacterPreview";
import { DEFAULT_APPEARANCE } from "@/types/appearance";
import { Plus, Trash2 } from "lucide-react";

interface SaveSlot {
  id: number;
  playerName?: string;
  team?: string;
  year?: number;
  week?: number;
  avatarId?: number;
}

interface LoadSaveProps {
  onLoadSlot?: (slotId: number) => void;
  onNewGame?: () => void;
  onDeleteSlot?: (slotId: number) => void;
}

export default function LoadSave({ onLoadSlot, onNewGame, onDeleteSlot }: LoadSaveProps) {
  // todo: remove mock functionality
  const [saveSlots] = useState<SaveSlot[]>([
    { id: 1, playerName: "Marcus Johnson", team: "Central High", year: 2026, week: 8, avatarId: 1 },
    { id: 2, playerName: "Tyler Williams", team: "Westside Prep", year: 2025, week: 15, avatarId: 3 },
    { id: 3 }, // Empty slot
    { id: 4 }, // Empty slot
    { id: 5 }, // Empty slot
  ]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const handleDelete = (slotId: number) => {
    setShowDeleteConfirm(null);
    onDeleteSlot?.(slotId);
    console.log('Delete slot:', slotId);
  };

  return (
    <div>
      <main className="px-4 pt-4 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Load / Continue</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {saveSlots.map((slot) => (
              <div key={slot.id} className="border border-border rounded-lg p-4">
                {slot.playerName ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CharacterPreview 
                        size="sm" 
                        appearance={DEFAULT_APPEARANCE}
                        className="w-12 h-15"
                      />
                      
                      <div>
                        <h3 className="font-semibold" data-testid={`text-player-name-${slot.id}`}>
                          {slot.playerName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {slot.team}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {slot.year} • W{slot.week?.toString().padStart(2, '0')}
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
                        onClick={() => onLoadSlot?.(slot.id)}
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
                      onClick={onNewGame}
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