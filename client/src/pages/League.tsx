import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import GameHeader from "@/components/GameHeader";
import BottomTabBar from "@/components/BottomTabBar";

interface TeamStanding {
  rank: number;
  name: string;
  wins: number;
  losses: number;
  streak: string;
  color: string;
}

interface ScheduleGame {
  homeTeam: string;
  awayTeam: string;
  week: number;
  result?: string;
}

interface LeagueProps {
  defaultTab?: string;
}

export default function League({ defaultTab = "standings" }: LeagueProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // todo: remove mock functionality
  const standings: TeamStanding[] = [
    { rank: 1, name: "Central High", wins: 12, losses: 2, streak: "W3", color: "#7A5BFF" },
    { rank: 2, name: "Westside Prep", wins: 11, losses: 3, streak: "W1", color: "#38E1C6" },
    { rank: 3, name: "Riverside Academy", wins: 10, losses: 4, streak: "L1", color: "#FF6B35" },
    { rank: 4, name: "Oak Valley", wins: 9, losses: 5, streak: "W2", color: "#22C55E" },
    { rank: 5, name: "Pine Ridge", wins: 8, losses: 6, streak: "L2", color: "#F59E0B" },
    { rank: 6, name: "Mountain View", wins: 7, losses: 7, streak: "W1", color: "#EF4444" },
    { rank: 7, name: "Valley Tech", wins: 5, losses: 9, streak: "L3", color: "#8B5CF6" },
    { rank: 8, name: "East Side", wins: 3, losses: 11, streak: "L5", color: "#06B6D4" },
  ];

  const schedule: ScheduleGame[] = [
    { homeTeam: "Central High", awayTeam: "Oak Valley", week: 15 },
    { homeTeam: "Westside Prep", awayTeam: "Pine Ridge", week: 15 },
    { homeTeam: "Riverside Academy", awayTeam: "Mountain View", week: 16 },
    { homeTeam: "Valley Tech", awayTeam: "East Side", week: 16 },
    { homeTeam: "Oak Valley", awayTeam: "Central High", week: 17 },
    { homeTeam: "Pine Ridge", awayTeam: "Westside Prep", week: 17 },
    { homeTeam: "Mountain View", awayTeam: "Riverside Academy", week: 18 },
    { homeTeam: "East Side", awayTeam: "Valley Tech", week: 18 },
  ];

  useEffect(() => {
    // Get tab from URL params if present
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && (tab === 'standings' || tab === 'schedule')) {
      setActiveTab(tab);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GameHeader />
      
      <main className="px-4 pt-4 pb-20">
        <Card>
          <CardHeader>
            <CardTitle>League</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="standings" data-testid="tab-standings">Standings</TabsTrigger>
                <TabsTrigger value="schedule" data-testid="tab-schedule">Schedule</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standings" className="mt-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground border-b">
                    <div className="col-span-1">#</div>
                    <div className="col-span-6">Team</div>
                    <div className="col-span-2">W-L</div>
                    <div className="col-span-3">Streak</div>
                  </div>
                  
                  {standings.map((team) => (
                    <div 
                      key={team.rank}
                      className="grid grid-cols-12 gap-2 items-center p-3 rounded-lg hover:bg-muted/50 hover-elevate"
                      data-testid={`standing-row-${team.rank}`}
                    >
                      <div className="col-span-1">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-mono">
                          {team.rank}
                        </div>
                      </div>
                      
                      <div className="col-span-6 flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: team.color }}
                        />
                        <span className="font-medium text-sm">{team.name}</span>
                      </div>
                      
                      <div className="col-span-2">
                        <span className="font-mono text-sm">{team.wins}-{team.losses}</span>
                      </div>
                      
                      <div className="col-span-3">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            team.streak.startsWith('W') 
                              ? 'border-green-500 text-green-500' 
                              : 'border-red-500 text-red-500'
                          }`}
                        >
                          {team.streak}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="mt-4">
                <div className="space-y-3">
                  {schedule.map((game, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 hover-elevate"
                      data-testid={`schedule-game-${index}`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {game.awayTeam} @ {game.homeTeam}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Week {game.week}
                        </div>
                      </div>
                      
                      {game.result && (
                        <Badge variant="outline" className="text-xs">
                          {game.result}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <BottomTabBar />
    </div>
  );
}