import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSave } from '@/hooks/useSave';
import { advanceWeek, simMultipleWeeks, simToEndOfSeason } from '@/state/sim';
import GameHeader from '@/components/GameHeader';
import BottomTabBar from '@/components/BottomTabBar';

export default function SimPage() {
  const [weeksToSim, setWeeksToSim] = useState(1);
  const [isSimming, setIsSimming] = useState(false);
  const saveState = useSave();
  const { toast } = useToast();

  const handleSimNextWeek = async () => {
    setIsSimming(true);
    try {
      const updatedSave = advanceWeek(saveState);
      
      toast({
        title: "Week Advanced",
        description: `Simulated to Week ${updatedSave.week}`,
      });
    } catch (error) {
      toast({
        title: "Simulation Error",
        description: "Failed to simulate week",
        variant: "destructive",
      });
    } finally {
      setIsSimming(false);
    }
  };

  const handleSimMultipleWeeks = async () => {
    if (weeksToSim <= 0) return;
    
    setIsSimming(true);
    try {
      const updatedSave = simMultipleWeeks(saveState, weeksToSim);
      
      toast({
        title: "Weeks Simulated",
        description: `Simulated ${weeksToSim} week(s)`,
      });
    } catch (error) {
      toast({
        title: "Simulation Error",
        description: "Failed to simulate multiple weeks",
        variant: "destructive",
      });
    } finally {
      setIsSimming(false);
    }
  };

  const handleSimToEndOfSeason = async () => {
    setIsSimming(true);
    try {
      const updatedSave = simToEndOfSeason(saveState);
      
      toast({
        title: "Season Simulated",
        description: `Completed season, advanced to ${updatedSave.year}`,
      });
    } catch (error) {
      toast({
        title: "Simulation Error", 
        description: "Failed to simulate season",
        variant: "destructive",
      });
    } finally {
      setIsSimming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader />
      <main className="px-4 pt-4 pb-32 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Simulation</h1>
          <p className="text-muted-foreground">Skip ahead in your career</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Season Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{saveState.year}</div>
                <div className="text-sm text-muted-foreground">Year</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{saveState.week}</div>
                <div className="text-sm text-muted-foreground">Week</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{saveState.age}</div>
                <div className="text-sm text-muted-foreground">Age</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold">{saveState.status.schoolPhase}</div>
              <div className="text-sm text-muted-foreground">Current Phase</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulation Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleSimNextWeek}
              disabled={isSimming || saveState.week > 20}
              className="w-full"
              data-testid="button-sim-next-week"
            >
              {isSimming ? 'Simulating...' : 'Sim Next Week'}
            </Button>

            <div className="space-y-2">
              <Label htmlFor="weeks-input">Sim Multiple Weeks</Label>
              <div className="flex gap-2">
                <Input
                  id="weeks-input"
                  type="number"
                  min={1}
                  max={20}
                  value={weeksToSim}
                  onChange={(e) => setWeeksToSim(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1"
                  data-testid="input-weeks-to-sim"
                />
                <Button
                  onClick={handleSimMultipleWeeks}
                  disabled={isSimming || saveState.week > 20 || weeksToSim <= 0}
                  data-testid="button-sim-multiple-weeks"
                >
                  {isSimming ? 'Simming...' : 'Sim'}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSimToEndOfSeason}
              disabled={isSimming || saveState.week > 20}
              variant="outline"
              className="w-full"
              data-testid="button-sim-end-season"
            >
              {isSimming ? 'Simulating...' : 'Sim to End of Season'}
            </Button>
          </CardContent>
        </Card>

        {saveState.week > 20 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Season Complete!</h3>
                <p className="text-muted-foreground">
                  Regular season finished. Check your awards and prepare for next season.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <BottomTabBar />
    </div>
  );
}