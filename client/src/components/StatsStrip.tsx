import { Progress } from "@/components/ui/progress";

interface StatItem {
  label: string;
  current: number;
  max: number;
  color?: string;
}

interface StatsStripProps {
  stats: StatItem[];
}

export default function StatsStrip({ stats }: StatsStripProps) {
  return (
    <div className="bg-card border-t border-card-border p-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 4rem)' }}>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <div key={stat.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{stat.label}</span>
              <span className="font-mono font-medium" data-testid={`stat-${stat.label.toLowerCase()}`}>
                {stat.current}/{stat.max}
              </span>
            </div>
            <Progress 
              value={(stat.current / stat.max) * 100} 
              className="h-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}