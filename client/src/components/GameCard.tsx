import React from "react";
import AvatarOrPhoto from "@/components/AvatarOrPhoto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import TeamLogo from "@/components/TeamLogo";
import { TEAMS } from "@/data/teams";

interface GameCardProps {
  opponentId: string;
  gameType: string;
  location?: string;
  energyCost: number;
  onPlayGame?: () => void;
  onScouting?: () => void;
}

export default function GameCard({
  opponentId,
  gameType = "Regular Season", 
  location = "Home",
  energyCost = 3,
  onPlayGame,
  onScouting
}: GameCardProps) {
 feat/photo-avatar

  const opponent = TEAMS[opponentId];
  
  if (!opponent) {
    return (
      <Card className="hover-elevate">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Invalid opponent</p>
        </CardContent>
      </Card>
    );
  }
 main
  // No procedural avatar scripts; purely UI
  return (
    <Card className="hover-elevate">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Next Game</CardTitle>
          <Badge variant="outline" className="text-xs">
            This week
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 py-4">
          {/* Team logo on the left */}
          <div className="flex-shrink-0">
 feat/photo-avatar
            <AvatarOrPhoto size={64} />

            <TeamLogo teamId={opponentId} size={64} />
 main
          </div>
          
          {/* Game info on the right */}
          <div className="flex-1 text-center">
            <h3 className="font-semibold text-lg" data-testid="text-opponent">
              vs {opponent.name} ({opponent.abbrev})
            </h3>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{gameType}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="default" 
            className="w-full"
            onClick={onPlayGame}
            data-testid="button-play-game"
          >
            Play Game (-{energyCost} Energy)
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onScouting}
            data-testid="button-scouting"
          >
            Scouting
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}