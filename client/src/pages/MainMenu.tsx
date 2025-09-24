import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Users, Settings } from "lucide-react";
import { activeSlot } from "@/utils/localStorage";

interface MainMenuProps {
  onNavigate?: (path: string) => void;
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  const handlePlayClick = () => {
    const currentSlot = activeSlot.get();
    if (currentSlot) {
      onNavigate?.('/home');
    } else {
      onNavigate?.('/new');
    }
  };

  const menuItems = [
    { icon: Play, label: "Play", onClick: handlePlayClick, primary: true },
    { icon: RotateCcw, label: "Load / Continue", path: "/load" },
    { icon: Users, label: "Roster Editor", path: "/roster-editor" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen arena-bg flex flex-col justify-center items-center p-4">
      <div className="text-center mb-12">
        <h1 className="font-pixel text-4xl text-white mb-2" data-testid="text-game-title">
          Hoop Dreams
        </h1>
        <p className="text-white/80 text-sm">Basketball Life Simulator</p>
      </div>
      
      <div className="w-full max-w-sm space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path || index}
              variant={item.primary ? "default" : "outline"}
              size="lg"
              className="w-full justify-start gap-3 h-12"
              onClick={() => item.onClick ? item.onClick() : onNavigate?.(item.path)}
              data-testid={`button-${item.label.toLowerCase().replace(/[\s/]/g, '-')}`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Button>
          );
        })}
      </div>
      
      <div className="mt-12">
        <Badge variant="secondary" className="text-xs">
          Version 0.2
        </Badge>
      </div>
    </div>
  );
}