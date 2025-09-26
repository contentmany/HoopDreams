import type { Team } from '@/types';
import { seedTeams } from '@/lib/teamData';

interface TeamLogoProps {
  teamId?: string;
  team?: Team;
  size?: number;
  className?: string;
}

export default function TeamLogo({ teamId, team, size = 32, className = '' }: TeamLogoProps) {
  // Get team data - either from prop or by looking up teamId
  let teamData = team;
  if (!teamData && teamId) {
    const teams = seedTeams();
    teamData = teams.find(t => t.id === teamId);
  }
  
  if (!teamData) {
    return (
      <div 
        className={`bg-muted rounded-full flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        data-testid="team-logo-unknown"
      >
        <span className="text-xs text-muted-foreground">?</span>
      </div>
    );
  }

  const logoSize = `${size}px`;
  const fontSize = `${size * 0.5}px`;
  
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-full font-bold ${className}`}
      style={{
        width: logoSize,
        height: logoSize,
        backgroundColor: '#2a2a2a',
        color: teamData.colors.primary,
        border: `2px solid ${teamData.colors.secondary}`,
        fontSize: fontSize,
        lineHeight: '1'
      }}
      data-testid={`team-logo-${teamData.id}`}
      title={teamData.name}
    >
      {teamData.abbrev[0]}
    </div>
  );
}