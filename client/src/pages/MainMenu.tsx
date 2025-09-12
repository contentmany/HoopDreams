import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Users, Mail, Settings } from "lucide-react";

interface MainMenuProps {
  onNavigate?: (path: string) => void;
}

export default function MainMenu({ onNavigate }: MainMenuProps) {
  const menuItems = [
    { icon: Play, label: "Play", path: "/new", primary: true },
    { icon: RotateCcw, label: "Load / Continue", path: "/load" },
    { icon: Users, label: "Roster Editor", path: "/roster-editor" },
    { icon: Mail, label: "Inbox", path: "/inbox" },
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
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant={item.primary ? "default" : "outline"}
              size="lg"
              className="w-full justify-start gap-3 h-12"
              onClick={() => onNavigate?.(item.path)}
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
          Version 0.1
        </Badge>
      </div>
    </div>
  );
}