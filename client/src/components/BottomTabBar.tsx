import { useLocation } from "wouter";
import { Home, Trophy, Users, MessageCircle, Settings, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/league", icon: Trophy, label: "League" },
  { path: "/team", icon: Users, label: "Team" },
  { path: "/accessories", icon: Package, label: "Accessories" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export default function BottomTabBar() {
  const [location, setLocation] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)' }}>
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const isActive = location === tab.path || (location.startsWith(tab.path) && tab.path !== "/home");
          const Icon = tab.icon;
          
          return (
            <Button
              key={tab.path}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 min-h-12 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setLocation(tab.path)}
              data-testid={`tab-${tab.label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}