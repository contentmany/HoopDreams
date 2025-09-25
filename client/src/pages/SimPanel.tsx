import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import BackLink from '@/components/BackLink';
import { useGameStore } from '@/state/gameStore';

export default function SimPanel() {
  const { league, career, advanceWeek, advanceToSeasonEnd, playNextGame, getNextGame } = useGameStore();
  const [simWeeks, setSimWeeks] = useState('1');
  const [isSimming, setIsSimming] = useState(false);
  
  const nextGame = getNextGame();
  const canPlay = nextGame && career.player.energy >= 3;
  const remainingWeeks = league.totalWeeks - league.week + 1;

  const handleSimWeek = async () => {
    setIsSimming(true);
    try {
      advanceWeek(1);
    } finally {
      setIsSimming(false);
    }
  };

  const handleSimMultipleWeeks = async () => {
    const weeks = parseInt(simWeeks) || 1;
    const maxWeeks = Math.min(weeks, remainingWeeks);
    
    setIsSimming(true);
    try {
      advanceWeek(maxWeeks);
    } finally {
      setIsSimming(false);
    }
  };

  const handleSimToEnd = async () => {
    setIsSimming(true);
    try {
      advanceToSeasonEnd();
    } finally {
      setIsSimming(false);
    }
  };

  const handlePlayGame = async () => {
    setIsSimming(true);
    try {
      playNextGame();
    } finally {
      setIsSimming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <BackLink />
          <div>
            <h1 className="text-2xl font-bold text-primary">Simulation Controls</h1>
            <p className="text-sm text-muted-foreground">Advance your career</p>
          </div>
        </div>

        {/* Season Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{league.year}</div>
                <div className="text-xs text-muted-foreground">Season</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{league.week}</div>
                <div className="text-xs text-muted-foreground">Week</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{remainingWeeks}</div>
                <div className="text-xs text-muted-foreground">Weeks Left</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{career.player.energy}</div>
                <div className="text-xs text-muted-foreground">Energy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Game */}
        {nextGame && (
          <Card>
            <CardHeader>
              <CardTitle>Next Game</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-lg font-semibold">Week {nextGame.week}</div>
                  <div className="text-sm text-muted-foreground">
                    {nextGame.homeTeamId === career.teamId ? 'vs' : '@'} Opponent
                  </div>
                </div>
                
                <Button
                  className="w-full"
                  onClick={handlePlayGame}
                  disabled={!canPlay || isSimming}
                  data-testid="button-play-game"
                >
                  {isSimming ? 'Playing...' : `Play Game (-3 Energy)`}
                </Button>
                
                {!canPlay && career.player.energy < 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Not enough energy to play. Sim weeks to recover energy.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Simulation Options */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sim Next Week */}
            <div>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleSimWeek}
                disabled={isSimming || remainingWeeks <= 0}
                data-testid="button-sim-week"
              >
                {isSimming ? 'Simming...' : 'Sim Next Week'}
              </Button>
            </div>

            {/* Sim Multiple Weeks */}
            <div className="space-y-2">
              <Label htmlFor="sim-weeks">Sim Multiple Weeks</Label>
              <div className="flex gap-2">
                <Input
                  id="sim-weeks"
                  type="number"
                  min="1"
                  max={remainingWeeks}
                  value={simWeeks}
                  onChange={(e) => setSimWeeks(e.target.value)}
                  className="flex-1"
                  data-testid="input-sim-weeks"
                />
                <Button
                  onClick={handleSimMultipleWeeks}
                  disabled={isSimming || remainingWeeks <= 0 || !simWeeks}
                  data-testid="button-sim-multiple-weeks"
                >
                  {isSimming ? 'Simming...' : 'Sim'}
                </Button>
              </div>
            </div>

            {/* Sim to End */}
            <div>
              <Button
                className="w-full"
                variant="destructive"
                onClick={handleSimToEnd}
                disabled={isSimming || remainingWeeks <= 0}
                data-testid="button-sim-to-end"
              >
                {isSimming ? 'Simming...' : `Sim to End of Season (${remainingWeeks} weeks)`}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</div>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Simulation Impact
                </p>
                <ul className="space-y-1 text-yellow-700 dark:text-yellow-300">
                  <li>• Playing games manually gives better control over performance</li>
                  <li>• Simming advances time but may result in less optimal outcomes</li>
                  <li>• Energy recovers slowly over time - sim multiple weeks to recover</li>
                  <li>• Season ends after {league.totalWeeks} weeks, then advances to next year</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {remainingWeeks <= 0 && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardContent className="pt-6 text-center">
              <div className="space-y-2">
                <div className="text-2xl">🏆</div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Season Complete!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Advance to next season using the simulation controls.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}