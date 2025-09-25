import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import BackLink from '@/components/BackLink';
import TeamLogo from '@/components/TeamLogo';
import { useGameStore } from '@/state/gameStore';
import { seedTeams } from '@/lib/teamData';

export default function PlayerProfile() {
  const { career, league, getCurrentAge } = useGameStore();
  const { player } = career;
  const teams = seedTeams();
  const playerTeam = teams.find(t => t.id === career.teamId);
  const currentAge = getCurrentAge();

  // Calculate season stats from played games
  const playedGames = league.schedule.filter(game => 
    game.played && 
    game.playerLine &&
    (game.homeTeamId === career.teamId || game.awayTeamId === career.teamId)
  );

  const seasonStats = playedGames.reduce((totals, game) => {
    if (game.playerLine) {
      totals.pts += game.playerLine.pts;
      totals.reb += game.playerLine.reb;
      totals.ast += game.playerLine.ast;
      totals.stl += game.playerLine.stl;
      totals.blk += game.playerLine.blk;
      totals.games += 1;
    }
    return totals;
  }, { pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, games: 0 });

  const averages = {
    pts: seasonStats.games > 0 ? (seasonStats.pts / seasonStats.games).toFixed(1) : '0.0',
    reb: seasonStats.games > 0 ? (seasonStats.reb / seasonStats.games).toFixed(1) : '0.0',
    ast: seasonStats.games > 0 ? (seasonStats.ast / seasonStats.games).toFixed(1) : '0.0',
    stl: seasonStats.games > 0 ? (seasonStats.stl / seasonStats.games).toFixed(1) : '0.0',
    blk: seasonStats.games > 0 ? (seasonStats.blk / seasonStats.games).toFixed(1) : '0.0'
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <BackLink />
          <div>
            <h1 className="text-2xl font-bold text-primary">Player Profile</h1>
            <p className="text-sm text-muted-foreground">Basketball Life Simulator</p>
          </div>
        </div>

        {/* Player Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={player.photo} alt={`${player.firstName} ${player.lastName}`} />
                  <AvatarFallback className="text-lg">
                    {player.firstName[0]}{player.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold" data-testid="text-player-name">
                    {player.firstName} {player.lastName} ({currentAge})
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{player.position}</Badge>
                    <Badge variant="outline">{player.archetype}</Badge>
                    {playerTeam && (
                      <div className="flex items-center gap-2">
                        <TeamLogo team={playerTeam} size={20} />
                        <span className="text-sm text-muted-foreground">{playerTeam.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Energy</div>
                    <div className="font-semibold">{player.energy}/100</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Health</div>
                    <div className="font-semibold">{player.health}/100</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Chemistry</div>
                    <div className="font-semibold">{player.chemistry}/100</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Reputation</div>
                    <div className="font-semibold">{player.reputation}/100</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Season Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Season Stats ({league.year})</CardTitle>
          </CardHeader>
          <CardContent>
            {seasonStats.games > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Games Played: {seasonStats.games}
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="text-ppg">
                      {averages.pts}
                    </div>
                    <div className="text-xs text-muted-foreground">PPG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="text-rpg">
                      {averages.reb}
                    </div>
                    <div className="text-xs text-muted-foreground">RPG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="text-apg">
                      {averages.ast}
                    </div>
                    <div className="text-xs text-muted-foreground">APG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="text-spg">
                      {averages.stl}
                    </div>
                    <div className="text-xs text-muted-foreground">SPG</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="text-bpg">
                      {averages.blk}
                    </div>
                    <div className="text-xs text-muted-foreground">BPG</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm text-center">
                  <div>
                    <div className="font-semibold">{seasonStats.pts}</div>
                    <div className="text-muted-foreground">Total PTS</div>
                  </div>
                  <div>
                    <div className="font-semibold">{seasonStats.reb}</div>
                    <div className="text-muted-foreground">Total REB</div>
                  </div>
                  <div>
                    <div className="font-semibold">{seasonStats.ast}</div>
                    <div className="text-muted-foreground">Total AST</div>
                  </div>
                  <div>
                    <div className="font-semibold">{seasonStats.stl}</div>
                    <div className="text-muted-foreground">Total STL</div>
                  </div>
                  <div>
                    <div className="font-semibold">{seasonStats.blk}</div>
                    <div className="text-muted-foreground">Total BLK</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No games played yet this season.</p>
                <p className="text-sm mt-1">Stats will appear after playing games.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Awards */}
        <Card>
          <CardHeader>
            <CardTitle>Awards</CardTitle>
          </CardHeader>
          <CardContent>
            {player.awards.length > 0 ? (
              <div className="space-y-2">
                {player.awards.map((award, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {award}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No awards yet.</p>
                <p className="text-sm mt-1">Keep playing to earn achievements!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle>Career History</CardTitle>
          </CardHeader>
          <CardContent>
            {player.history.length > 0 ? (
              <div className="space-y-3">
                {player.history.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm">{event}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No career events yet.</p>
                <p className="text-sm mt-1">Your journey is just beginning!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}