import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGameStore } from "@/state/gameStore";
import { useLocation } from "wouter";
import AvatarPhoto from "@/components/AvatarPhoto";

export default function LoadSave() {
  const [, setLocation] = useLocation();
  const { hasValidPlayer } = useGameStore();

  const handleLoadExistingGame = () => {
    if (hasValidPlayer()) {
      setLocation('/home');
    }
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