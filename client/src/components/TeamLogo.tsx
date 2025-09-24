import { TEAMS } from "@/data/teams";

interface TeamLogoProps {
  teamId: string;
  size?: number;
  className?: string;
}

export default function TeamLogo({ teamId, size = 48, className = "" }: TeamLogoProps) {
  const team = TEAMS[teamId];
  
  if (!team) {
    return (
      <div 
        className={`bg-muted rounded flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-muted-foreground">?</span>
      </div>
    );
  }

  return (
    <img
      src={team.logo}
      alt={`${team.name} logo`}
      width={size}
      height={size}
      className={`rounded ${className}`}
      style={{ width: size, height: size, objectFit: "contain" }}
      onError={(e) => {
        // Fallback to colored square with abbrev if image fails to load
        const target = e.target as HTMLImageElement;
        const fallback = document.createElement('div');
        fallback.className = `inline-flex items-center justify-center rounded text-xs font-bold text-white ${className}`;
        fallback.style.width = `${size}px`;
        fallback.style.height = `${size}px`;
        fallback.style.backgroundColor = team.colors.primary;
        fallback.textContent = team.abbrev;
        target.parentNode?.replaceChild(fallback, target);
      }}
    />
  );
}