import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Menu } from "lucide-react";
import SimModal from "@/components/SimModal";

interface GameHeaderProps {
  title?: string;
  era?: string;
  year?: number;
  week?: number;
  maxWeeks?: number;
  showAdvanceWeek?: boolean;
  onAdvanceWeek?: () => void;
  onSimWeeks?: (weeks: number) => void;
  onMenuToggle?: () => void;
}

export default function GameHeader({ 
  title = "Hoop Dreams", 
  era = "High School", 
  year = 2026, 
  week = 1,
  maxWeeks = 20,
  showAdvanceWeek = false,
  onAdvanceWeek,
  onSimWeeks,
  onMenuToggle
}: GameHeaderProps) {
  const [showSimModal, setShowSimModal] = useState(false);

  const handleSimClick = () => {
    setShowSimModal(true);
  };

  const handleSimWeeks = (weeks: number) => {
    if (weeks === 1 && onAdvanceWeek) {
      onAdvanceWeek();
    } else if (onSimWeeks) {
      onSimWeeks(weeks);
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-card-border px-4 py-3" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}>
      <div className="flex items-center justify-between">
        {onMenuToggle && (
          <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden" data-testid="button-menu">
            <Menu className="w-5 h-5" />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <h1 className="font-pixel text-lg text-primary">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {showAdvanceWeek && (
            <>
              <Badge variant="secondary" className="text-xs">
                {era}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {year}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                W{week.toString().padStart(2, '0')}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSimClick}
                data-testid="button-sim-control"
                className="text-xs font-medium font-mono"
              >
                &gt;&gt;
              </Button>
            </>
          )}
        </div>
      </div>

      <SimModal 
        isOpen={showSimModal}
        onClose={() => setShowSimModal(false)}
        onSimWeeks={handleSimWeeks}
        currentWeek={week}
        maxWeeks={maxWeeks}
      />
    </header>
  );
}