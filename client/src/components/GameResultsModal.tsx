import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trophy, TrendingUp, TrendingDown, Star, Zap } from "lucide-react";
import type { GameResult, OpponentTeam } from "@/utils/gameSimulation";

interface GameResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameResult: GameResult;
  opponent: OpponentTeam;
  location: 'Home' | 'Away';
}

export default function GameResultsModal({
  isOpen,
  onClose,
  gameResult,
  opponent,
  location
}: GameResultsModalProps) {
  if (!gameResult || !opponent) {
    return null;
  }
  
  const { playerStats, teamStats, gameGrade, energyUsed, injuryRisk } = gameResult;
  const isWin = teamStats.win;
  
  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'text-green-500';
    if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-500';
    if (['C+', 'C', 'C-'].includes(grade)) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isWin ? (
              <Trophy className="w-5 h-5 text-yellow-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            Game Result
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Final Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Your Team</p>
                    <p className="text-3xl font-bold">{teamStats.playerScore}</p>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">-</div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{opponent.name}</p>
                    <p className="text-3xl font-bold">{teamStats.opponentScore}</p>
                  </div>
                </div>
                
                <Badge 
                  variant={isWin ? "default" : "destructive"}
                  className="text-sm px-3 py-1"
                >
                  {isWin ? 'VICTORY' : 'DEFEAT'}
                </Badge>
                
                <div className="flex items-center justify-center gap-4 mt-3">
                  <Badge variant="outline" className="text-xs">
                    {location} Game
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    vs {opponent.name}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Player Performance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="w-5 h-5" />
                Your Performance
                <Badge variant="outline" className={`ml-auto ${getGradeColor(gameGrade)}`}>
                  Grade: {gameGrade}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Main stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{playerStats.points}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{playerStats.rebounds}</p>
                  <p className="text-xs text-muted-foreground">Rebounds</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{playerStats.assists}</p>
                  <p className="text-xs text-muted-foreground">Assists</p>
                </div>
              </div>
              
              <Separator />
              
              {/* Shooting stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Field Goals:</span>
                    <span className="font-medium">
                      {playerStats.fgm}/{playerStats.fga} 
                      ({playerStats.fga > 0 ? Math.round((playerStats.fgm / playerStats.fga) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Three-Pointers:</span>
                    <span className="font-medium">
                      {playerStats.threePM}/{playerStats.threePA}
                      ({playerStats.threePA > 0 ? Math.round((playerStats.threePM / playerStats.threePA) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Throws:</span>
                    <span className="font-medium">
                      {playerStats.ftm}/{playerStats.fta}
                      ({playerStats.fta > 0 ? Math.round((playerStats.ftm / playerStats.fta) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Steals:</span>
                    <span className="font-medium">{playerStats.steals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blocks:</span>
                    <span className="font-medium">{playerStats.blocks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turnovers:</span>
                    <span className="font-medium text-red-500">{playerStats.turnovers}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm pt-2 border-t">
                <span>Minutes Played:</span>
                <span className="font-medium">{playerStats.minutes}</span>
              </div>
            </CardContent>
          </Card>

          {/* Energy & Status */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Energy Used:</span>
                  </div>
                  <Badge variant="outline">-{energyUsed}</Badge>
                </div>
                
                {injuryRisk && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <TrendingDown className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600">
                      Risk of fatigue injury - consider resting next week
                    </span>
                  </div>
                )}
                
                {isWin && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">
                      Team morale boosted from victory!
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} data-testid="button-close-game-results">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}