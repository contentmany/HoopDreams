import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface TeamStanding {
  name: string;
  wins: number;
  losses: number;
  streak: string;
  color?: string;
}

interface ScheduleGame {
  homeTeam: string;
  awayTeam: string;
  week: number;
  result?: string;
}

interface LeagueSnapshotProps {
  standings: TeamStanding[];
  schedule: ScheduleGame[];
  onViewFull?: (tab: string) => void;
}

export default function LeagueSnapshot({ standings, schedule, onViewFull }: LeagueSnapshotProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">League Snapshot</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="standings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standings" className="mt-4 space-y-3">
            <div className="space-y-2">
              {standings.slice(0, 3).map((team, index) => (
                <div key={team.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono bg-muted">
                      {index + 1}
                    </div>
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: team.color || '#7A5BFF' }}
                    />
                    <span className="font-medium text-sm" data-testid={`team-${index}`}>
                      {team.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono">{team.wins}-{team.losses}</span>
                    <Badge variant="outline" className="text-xs">
                      {team.streak}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center gap-1"
              onClick={() => onViewFull?.('standings')}
              data-testid="button-view-full-standings"
            >
              View full standings <ExternalLink className="w-3 h-3" />
            </Button>
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-4 space-y-3">
            <div className="space-y-2">
              {schedule.slice(0, 3).map((game, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                  <div className="flex-1">
                    <div className="text-sm font-medium">
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
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center gap-1"
              onClick={() => onViewFull?.('schedule')}
              data-testid="button-view-full-schedule"
            >
              View full schedule <ExternalLink className="w-3 h-3" />
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}