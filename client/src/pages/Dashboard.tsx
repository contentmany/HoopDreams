import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackLink from "@/components/BackLink";
import TeamLogo from "@/components/TeamLogo";
import { useGameStore } from "@/state/gameStore";
import { seedTeams } from "@/lib/teamData";
import { useToast } from "@/hooks/use-toast";

interface DashboardProps {
  onNavigate?: (path: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { career, league, playNextGame, getNextGame, getCurrentAge, initIfNeeded } = useGameStore();
  const { toast } = useToast();
  const teams = seedTeams();
  const playerTeam = teams.find(t => t.id === career.teamId);
  const nextGame = getNextGame();
  const currentAge = getCurrentAge();

  useEffect(() => {
    initIfNeeded();
  }, [initIfNeeded]);

  const handlePlayGame = () => {
    if (!nextGame || career.player.energy < 3) {
      toast({
        title: "Cannot play game",
        description: career.player.energy < 3 ? "Not enough energy" : "No game scheduled"
      });
      return;
    }
    
    const success = playNextGame();
    if (success) {
      toast({
        title: "Game completed",
        description: "Check your stats and standings!"
      });
    }
  };

  const getOpponentTeam = () => {
    if (!nextGame) return null;
    const opponentId = nextGame.homeTeamId === career.teamId ? nextGame.awayTeamId : nextGame.homeTeamId;
    return teams.find(t => t.id === opponentId);
  };

  const opponentTeam = getOpponentTeam();
  const isHome = nextGame?.homeTeamId === career.teamId;

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with player info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {career.player.firstName} {career.player.lastName} ({currentAge})
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{league.level}</Badge>
                <Badge variant="outline">{league.year}</Badge>
                <Badge variant="outline">W{league.week}</Badge>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate?.('/sim')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            data-testid="button-overflow"
          >
            <span className="text-xl">»</span>
          </button>
        </div>

        {/* Player avatar and team info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate?.('/player')}>
                <Avatar className="w-16 h-16">
                  <AvatarImage src={career.player.photo} alt={`${career.player.firstName} ${career.player.lastName}`} />
                  <AvatarFallback>
                    {career.player.firstName[0]}{career.player.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {playerTeam && <TeamLogo team={playerTeam} size={24} />}
                  <div>
                    <p className="font-semibold">{playerTeam?.name || 'Your Team'}</p>
                    <p className="text-sm text-muted-foreground">
                      {career.player.position} • {career.player.archetype}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold">{career.player.energy}</div>
                  <div className="text-muted-foreground">Energy</div>
                </div>
                <div>
                  <div className="font-semibold">{career.player.chemistry}</div>
                  <div className="text-muted-foreground">Chemistry</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Game */}
        {nextGame && opponentTeam && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Next Game</h3>
                  <p className="text-sm text-muted-foreground">Week {nextGame.week} • Regular Season</p>
                </div>
                
                <div className="flex items-center justify-center gap-6">
                  {/* Player Team */}
                  <div className="text-center">
                    {playerTeam && <TeamLogo team={playerTeam} size={48} className="mx-auto mb-2" />}
                    <p className="font-medium">{playerTeam?.name}</p>
                    <p className="text-xs text-muted-foreground">{isHome ? 'Home' : 'Away'}</p>
                  </div>
                  
                  {/* VS */}
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-bold text-sm">VS</span>
                  </div>
                  
                  {/* Opponent */}
                  <div className="text-center">
                    <TeamLogo team={opponentTeam} size={48} className="mx-auto mb-2" />
                    <p className="font-medium">{opponentTeam.name}</p>
                    <p className="text-xs text-muted-foreground">{isHome ? 'Away' : 'Home'}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePlayGame}
                  disabled={career.player.energy < 3}
                  className="w-full"
                  data-testid="button-play-game"
                >
                  Play Game (-3 Energy)
                </Button>
                
                {career.player.energy < 3 && (
                  <p className="text-sm text-muted-foreground">
                    Not enough energy. Rest or simulate weeks to recover.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!nextGame && (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="space-y-3">
                <div className="text-4xl">🏆</div>
                <div>
                  <h3 className="text-lg font-semibold">Season Complete!</h3>
                  <p className="text-sm text-muted-foreground">
                    Use simulation controls to advance to next season.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={() => onNavigate?.('/league')}
            data-testid="button-standings"
          >
            League Standings
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigate?.('/accessories')}
            data-testid="button-accessories"
          >
            Accessories
          </Button>
        </div>
      </div>
    </div>
  );
}
