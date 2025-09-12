import GameHeader from "@/components/GameHeader";
import BadgeManager from "@/components/BadgeManager";
import { player as playerStorage } from "@/utils/localStorage";
import { useState, useEffect } from "react";
import type { Player } from "@/utils/localStorage";

export default function Badges() {
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const currentPlayer = playerStorage.get();
    if (currentPlayer) {
      setPlayer(currentPlayer);
    }
  }, []);

  const handleUpdatePlayer = (updatedPlayer: Player) => {
    setPlayer(updatedPlayer);
    playerStorage.set(updatedPlayer);
  };

  if (!player) {
    return (
      <div className="min-h-screen bg-background">
        <GameHeader />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">No player data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GameHeader />
      <main className="px-4 pt-4 pb-8">
        <BadgeManager 
          player={player} 
          onUpdatePlayer={handleUpdatePlayer}
        />
      </main>
    </div>
  );
}