import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import BackLink from '@/components/BackLink';
import TeamLogo from '@/components/TeamLogo';
import { useGameStore } from '@/state/gameStore';
import { seedTeams } from '@/lib/teamData';

export default function League() {
  const { league, getStandingsByConference } = useGameStore();
  const teams = seedTeams();
  const [selectedConference, setSelectedConference] = useState(league.conferences[0]);

  const standings = getStandingsByConference(selectedConference);

  const formatWinPct = (pct: number) => {
    return (pct * 1000).toFixed(0).padStart(3, '0');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackLink />
            <div>
              <h1 className="text-2xl font-bold text-primary">League Standings</h1>
              <p className="text-sm text-muted-foreground">{league.level} - {league.year}</p>
            </div>
          </div>
          <Badge variant="outline" data-testid="text-week">
            Week {league.week}
          </Badge>
        </div>

        {/* Conference Tabs */}
        <Tabs value={selectedConference} onValueChange={setSelectedConference}>
          <TabsList className="grid w-full grid-cols-3">
            {league.conferences.map((conference) => (
              <TabsTrigger 
                key={conference} 
                value={conference}
                data-testid={`tab-${conference.toLowerCase().replace('/', '-')}`}
              >
                {conference}
              </TabsTrigger>
            ))}
          </TabsList>

          {league.conferences.map((conference) => (
            <TabsContent key={conference} value={conference}>
              <Card>
                <CardHeader>
                  <CardTitle>{conference} Conference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Team</th>
                          <th className="text-center p-2">GP</th>
                          <th className="text-center p-2">W</th>
                          <th className="text-center p-2">L</th>
                          <th className="text-center p-2">W%</th>
                          <th className="text-center p-2">GB</th>
                          <th className="text-center p-2">PFG</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conference === selectedConference && standings.map((row, index) => {
                          const team = teams.find(t => t.id === row.teamId);
                          if (!team) return null;

                          return (
                            <tr 
                              key={team.id} 
                              className="border-b hover:bg-muted/50 cursor-pointer"
                              data-testid={`standings-row-${team.id}`}
                              onClick={() => {
                                // TODO: Navigate to team page
                                console.log('Team clicked:', team.name);
                              }}
                            >
                              <td className="p-2">
                                <div className="flex items-center gap-3">
                                  <TeamLogo team={team} size={24} />
                                  <span className="font-medium">{team.name}</span>
                                </div>
                              </td>
                              <td className="text-center p-2" data-testid={`gp-${team.id}`}>
                                {row.gp}
                              </td>
                              <td className="text-center p-2" data-testid={`w-${team.id}`}>
                                {row.w}
                              </td>
                              <td className="text-center p-2" data-testid={`l-${team.id}`}>
                                {row.l}
                              </td>
                              <td className="text-center p-2" data-testid={`pct-${team.id}`}>
                                .{formatWinPct(row.pct)}
                              </td>
                              <td className="text-center p-2" data-testid={`gb-${team.id}`}>
                                {row.gb === 0 ? '-' : row.gb.toFixed(1)}
                              </td>
                              <td className="text-center p-2" data-testid={`pfg-${team.id}`}>
                                {row.pfg.toFixed(1)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}