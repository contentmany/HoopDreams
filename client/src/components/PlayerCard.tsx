import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PlayerCardProps {
  firstName: string;
  lastName: string;
  position: string;
  archetype: string;
  team: string;
  teamColor?: string;
  avatarId?: number;
  ovr?: number;
  showStats?: boolean;
}

export default function PlayerCard({
  firstName,
  lastName,
  position,
  archetype,
  team,
  teamColor = "#7A5BFF",
  avatarId = 1,
  ovr,
  showStats = false
}: PlayerCardProps) {
  return (
    <Card className="hover-elevate">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src="/assets/avatars/avatars-collection.png" 
              alt={`${firstName} ${lastName}`}
              className="pixel-art"
            />
            <AvatarFallback className="font-pixel text-xs">
              {firstName[0]}{lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate" data-testid="text-player-name">
                {firstName} {lastName}
              </h3>
              {ovr && (
                <Badge variant="outline" className="text-xs font-mono">
                  {ovr} OVR
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {position}
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: teamColor, color: teamColor }}
              >
                {team}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {archetype}
            </p>
            
            {showStats && (
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div className="text-center">
                  <div className="font-mono font-semibold">85</div>
                  <div className="text-muted-foreground">SPD</div>
                </div>
                <div className="text-center">
                  <div className="font-mono font-semibold">92</div>
                  <div className="text-muted-foreground">SHT</div>
                </div>
                <div className="text-center">
                  <div className="font-mono font-semibold">78</div>
                  <div className="text-muted-foreground">DEF</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}