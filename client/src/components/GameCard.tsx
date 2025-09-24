import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

interface GameCardProps {
  opponent: string;
  gameType: string;
  location?: string;
  energyCost: number;
  onPlayGame?: () => void;
  onScouting?: () => void;
}

export default function GameCard({
  opponent,
  gameType = "Regular Season",
  location = "Home",
  energyCost = 3,
  onPlayGame,
  onScouting
}: GameCardProps) {
  // Load procedural avatar system
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/avatar.css';
    if (!document.querySelector('link[href="/css/avatar.css"]')) {
      document.head.appendChild(link);
    }
    
    // Initialize NPC avatars
    const script = document.createElement('script');
 feat/restore-from-archive
    script.type = 'module';
    script.innerHTML = `
      import { npcIntoCanvas } from '/js/avatar-hooks.js';
      setTimeout(() => {
        document.querySelectorAll('canvas.avatar64').forEach(c => {
          if (c.dataset.seed) npcIntoCanvas(c, c.dataset.seed, 64);
        });
      }, 100);
    `;
    script.src = '/js/avatar-hooks.js';
    script.onload = () => {
      setTimeout(() => {
        if (window.AvatarHooks) {
          document.querySelectorAll('canvas.avatar64').forEach(c => {
            const canvas = c as HTMLCanvasElement;
            if (canvas.dataset && canvas.dataset.seed) {
              window.AvatarHooks.npcIntoCanvas(canvas, canvas.dataset.seed, 64);
            }
          });
        }
      }, 100);
    };
 main
    document.head.appendChild(script);
  }, []);
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
          {/* Avatar on the left */}
          <div className="flex-shrink-0">
            <canvas className="avatar64" data-seed="game-card-default" style={{borderRadius: '8px'}}></canvas>
          </div>
          
          {/* Game info on the right */}
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center pixel-art">
                <span className="text-xs font-pixel">VS</span>
              </div>
            </div>
            <h3 className="font-semibold text-lg" data-testid="text-opponent">
              vs {opponent}
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