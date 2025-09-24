import GameHeader from "@/components/GameHeader";
import BottomTabBar from "@/components/BottomTabBar";
import StatsStrip from "@/components/StatsStrip";
import { activeSlot, saveSlots } from "@/utils/localStorage";

interface GameLayoutProps {
  children: React.ReactNode;
  title?: string;
  era?: string;
  year?: number;
  week?: number;
  maxWeeks?: number;
  showAdvanceWeek?: boolean;
  onAdvanceWeek?: () => void;
  onSimWeeks?: (weeks: number) => void;
  showStats?: boolean;
}

export default function GameLayout({ 
  children,
  title = "Hoop Dreams",
  era,
  year,
  week,
  maxWeeks,
  showAdvanceWeek,
  onAdvanceWeek,
  onSimWeeks,
  showStats = true
}: GameLayoutProps) {
  const currentSlot = activeSlot.get();
  const slots = saveSlots.get();
  const playerData = currentSlot ? slots[currentSlot - 1]?.player : null;
  const stats = playerData ? [
    { label: "Energy", current: playerData.energy || 100, max: 100 },
    { label: "Health", current: playerData.health || 100, max: 100 },
    { label: "Chemistry", current: playerData.chemistry || 50, max: 100 },
    { label: "Reputation", current: playerData.reputation || 0, max: 100 },
  ] : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GameHeader
        title={title}
        era={era}
        year={year}
        week={week}
        maxWeeks={maxWeeks}
        showAdvanceWeek={showAdvanceWeek}
        onAdvanceWeek={onAdvanceWeek}
        onSimWeeks={onSimWeeks}
      />
      
      <main className="flex-1" style={{ paddingBottom: showStats ? 'calc(env(safe-area-inset-bottom) + 8rem)' : 'calc(env(safe-area-inset-bottom) + 4rem)' }}>
        {children}
      </main>
      
      {showStats && stats.length > 0 && (
        <StatsStrip stats={stats} />
      )}
      
      <BottomTabBar />
    </div>
  );
}