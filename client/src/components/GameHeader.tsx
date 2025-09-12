import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Menu } from "lucide-react";

interface GameHeaderProps {
  title?: string;
  era?: string;
  year?: number;
  week?: number;
  showAdvanceWeek?: boolean;
  onAdvanceWeek?: () => void;
  onMenuToggle?: () => void;
}

export default function GameHeader({ 
  title = "Hoop Dreams", 
  era = "High School", 
  year = 2026, 
  week = 1,
  showAdvanceWeek = false,
  onAdvanceWeek,
  onMenuToggle
}: GameHeaderProps) {
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
                onClick={onAdvanceWeek}
                data-testid="button-advance-week"
                className="text-xs font-medium"
              >
                +1w <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}