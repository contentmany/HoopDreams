import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, FastForward, SkipForward, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimWeeks: (weeks: number) => void;
  currentWeek: number;
  maxWeeks?: number;
}

export default function SimModal({ 
  isOpen, 
  onClose, 
  onSimWeeks, 
  currentWeek, 
  maxWeeks = 20 
}: SimModalProps) {
  const [customWeeks, setCustomWeeks] = useState(1);
  const { toast } = useToast();

  const handleSimNext = () => {
    onSimWeeks(1);
    toast({
      title: "Week Simulated",
      description: "Simmed 1 week.",
    });
    onClose();
  };

  const handleSimCustom = () => {
    if (customWeeks < 1 || customWeeks > 8) {
      toast({
        title: "Invalid Input",
        description: "Please enter a number between 1 and 8.",
        variant: "destructive",
      });
      return;
    }

    const weeksToSim = Math.min(customWeeks, maxWeeks - currentWeek);
    if (weeksToSim <= 0) {
      toast({
        title: "Season Complete", 
        description: "Cannot simulate past the end of the season.",
        variant: "destructive",
      });
      return;
    }

    onSimWeeks(weeksToSim);
    toast({
      title: "Weeks Simulated",
      description: `Simmed ${weeksToSim} week${weeksToSim === 1 ? '' : 's'}.`,
    });
    onClose();
  };

  const handleSimToEnd = () => {
    const remainingWeeks = maxWeeks - currentWeek;
    if (remainingWeeks <= 0) {
      toast({
        title: "Season Complete",
        description: "Already at the end of the season.", 
        variant: "destructive",
      });
      return;
    }

    onSimWeeks(remainingWeeks);
    toast({
      title: "Season Simulated",
      description: `Simmed to end of season (${remainingWeeks} week${remainingWeeks === 1 ? '' : 's'}).`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FastForward className="w-5 h-5" />
            Simulation Control
          </DialogTitle>
          <DialogDescription>
            Advance time and simulate weeks quickly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Current Progress</p>
            <p className="font-medium">Week {currentWeek} of {maxWeeks}</p>
          </div>

          <Separator />

          {/* Sim Next Week */}
          <Button 
            onClick={handleSimNext}
            className="w-full justify-start gap-3"
            data-testid="button-sim-next-week"
          >
            <SkipForward className="w-4 h-4" />
            Sim Next Week
          </Button>

          {/* Sim Custom Weeks */}
          <div className="space-y-2">
            <Label htmlFor="custom-weeks" className="text-sm font-medium">
              Sim Multiple Weeks
            </Label>
            <div className="flex gap-2">
              <Input
                id="custom-weeks"
                type="number"
                min={1}
                max={8}
                value={customWeeks}
                onChange={(e) => setCustomWeeks(parseInt(e.target.value) || 1)}
                className="flex-1"
                data-testid="input-custom-weeks"
              />
              <Button 
                onClick={handleSimCustom}
                variant="outline"
                data-testid="button-sim-custom-weeks"
              >
                Sim
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter 1-8 weeks to simulate
            </p>
          </div>

          <Separator />

          {/* Sim to End */}
          <Button 
            onClick={handleSimToEnd}
            variant="outline"
            className="w-full justify-start gap-3"
            data-testid="button-sim-to-end"
          >
            <Calendar className="w-4 h-4" />
            Sim to End of Season
          </Button>

          <Separator />

          {/* Cancel */}
          <Button 
            onClick={onClose}
            variant="ghost"
            className="w-full justify-start gap-3"
            data-testid="button-cancel-sim"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}