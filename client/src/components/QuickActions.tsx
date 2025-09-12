import { Button } from "@/components/ui/button";
import { Trophy, Calendar, Users, MessageCircle, Award } from "lucide-react";

interface QuickAction {
  icon: any;
  label: string;
  path: string;
}

interface QuickActionsProps {
  onAction?: (path: string) => void;
}

const actions: QuickAction[] = [
  { icon: Award, label: "Badges", path: "/badges" },
  { icon: Trophy, label: "League", path: "/league?tab=standings" },
  { icon: Users, label: "Team", path: "/team" },
  { icon: MessageCircle, label: "Social", path: "/social" },
];

export default function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-4 gap-3 px-1">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.path}
            variant="outline"
            className="h-auto py-3 flex flex-col items-center gap-2 hover-elevate"
            onClick={() => onAction?.(action.path)}
            data-testid={`quick-${action.label.toLowerCase()}`}
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}