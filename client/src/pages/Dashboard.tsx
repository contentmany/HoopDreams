import GameHeader from "@/components/GameHeader";
import GameCard from "@/components/GameCard";
import QuickActions from "@/components/QuickActions";
import LeagueSnapshot from "@/components/LeagueSnapshot";
import StatsStrip from "@/components/StatsStrip";
import BottomTabBar from "@/components/BottomTabBar";

interface DashboardProps {
  onNavigate?: (path: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  // todo: remove mock functionality
  const standings = [
    { name: "Central High", wins: 12, losses: 2, streak: "W3", color: "#7A5BFF" },
    { name: "Westside Prep", wins: 11, losses: 3, streak: "W1", color: "#38E1C6" },
    { name: "Riverside Academy", wins: 10, losses: 4, streak: "L1", color: "#FF6B35" },
  ];

  const schedule = [
    { homeTeam: "Central High", awayTeam: "Oak Valley", week: 15 },
    { homeTeam: "Westside Prep", awayTeam: "Pine Ridge", week: 15 },
    { homeTeam: "Riverside Academy", awayTeam: "Mountain View", week: 16 },
  ];

  const stats = [
    { label: "Energy", current: 8, max: 10 },
    { label: "Mood", current: 7, max: 10 },
    { label: "Clout", current: 25, max: 100 },
    { label: "Chemistry", current: 65, max: 100 },
    { label: "Health", current: 100, max: 100 },
    { label: "Reputation", current: 15, max: 100 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <GameHeader 
        showAdvanceWeek={true}
        onAdvanceWeek={() => console.log('Advance week clicked')}
      />
      
      <main className="pb-32 px-4 pt-4 space-y-6">
        <GameCard 
          opponent="Riverside Academy"
          gameType="Regular Season"
          location="Home"
          energyCost={3}
          onPlayGame={() => alert('Game not implemented yet!')}
          onScouting={() => console.log('Scouting clicked')}
        />
        
        <QuickActions onAction={(path) => onNavigate?.(path)} />
        
        <LeagueSnapshot 
          standings={standings}
          schedule={schedule}
          onViewFull={(tab) => onNavigate?.(`/league?tab=${tab}`)}
        />
      </main>
      
      <StatsStrip stats={stats} />
      <BottomTabBar />
    </div>
  );
}