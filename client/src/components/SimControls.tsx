import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { loadSave, advanceWeek, simMultipleWeeks, simToEndOfSeason, type SaveState } from '@/state/sim';

interface SimControlsProps {
  currentSave?: SaveState | null;
  onSimComplete?: () => void;
}

export default function SimControls({ currentSave, onSimComplete }: SimControlsProps) {
  const [weeksToSim, setWeeksToSim] = useState(1);
  const [isSimming, setIsSimming] = useState(false);
  const { toast } = useToast();

  const handleSimNextWeek = async () => {
    const currentSave = loadSave();
    
    setIsSimming(true);
    try {
      const updatedSave = advanceWeek(currentSave);
      
      toast({
        title: "Week Advanced",
        description: `Simulated to Week ${updatedSave.week}`,
      });
      
      onSimComplete?.();
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
    const currentSave = loadSave();
    
    setIsSimming(true);
    try {
      const updatedSave = simMultipleWeeks(currentSave, weeksToSim);
      
      toast({
        title: "Weeks Simulated",
        description: `Simulated ${weeksToSim} week(s)`,
      });
      
      onSimComplete?.();
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
    const currentSave = loadSave();
    
    setIsSimming(true);
    try {
      const updatedSave = simToEndOfSeason(currentSave);
      
      toast({
        title: "Season Simulated",
        description: `Completed season, advanced to ${updatedSave.year}`,
      });
      
      onSimComplete?.();
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

  if (!currentSave) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No save data loaded</p>
        </CardContent>
      </Card>
    );
  }

  const isSeasonComplete = currentSave.week > 20;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Simulation Controls
          <div className="flex gap-2">
            <Badge variant="outline">
              {currentSave.season.level} - Year {currentSave.year}
            </Badge>
            <Badge variant="outline">
              {isSeasonComplete ? 'Tournament' : `W${currentSave.week < 10 ? `0${currentSave.week}` : currentSave.week}`}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSeasonComplete ? (
          <>
            <div className="flex gap-2">
              <Button
                onClick={handleSimNextWeek}
                disabled={isSimming}
                data-testid="button-sim-next-week"
              >
                {isSimming ? 'Simming...' : 'Sim Next Week'}
              </Button>
            </div>
            
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="weeks-input">Sim Multiple Weeks</Label>
                <Input
                  id="weeks-input"
                  type="number"
                  min="1"
                  max="8"
                  value={weeksToSim}
                  onChange={(e) => setWeeksToSim(Math.min(8, Math.max(1, parseInt(e.target.value) || 1)))}
                  disabled={isSimming}
                />
              </div>
              <Button
                onClick={handleSimMultipleWeeks}
                disabled={isSimming}
                data-testid="button-sim-multiple-weeks"
              >
                {isSimming ? 'Simming...' : 'Sim Weeks'}
              </Button>
            </div>
          </>
        ) : null}
        
        <Button
          onClick={handleSimToEndOfSeason}
          disabled={isSimming}
          variant="secondary"
          className="w-full"
          data-testid="button-sim-to-end"
        >
          {isSimming ? 'Simming...' : isSeasonComplete ? 'Start New Season' : 'Sim to End of Season'}
        </Button>
      </CardContent>
    </Card>
  );
}