import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { teams, settings } from "@/utils/localStorage";
import { 
  heightRanges, 
  inchesToFeetInches, 
  inchesToCm, 
  cmToInches,
  feetInchesToInches
} from "@/utils/gameConfig";
import { getArchetypesForPosition, isValidArchetypeForPosition } from "@/constants/positionArchetypes";

interface CreatePlayerProps {
  onCreatePlayer?: (playerData: any) => void;
  onNavigate?: (path: string) => void;
}

export default function CreatePlayer({ onCreatePlayer, onNavigate }: CreatePlayerProps) {
  const [playerData, setPlayerData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    archetype: "",
    teamId: "",
    heightInches: 74, // Default to 6'2"
  });

  const [useMetric, setUseMetric] = useState(false);
  const [heightFeet, setHeightFeet] = useState(6);
  const [heightInches, setHeightInches] = useState(2);
  const [heightCm, setHeightCm] = useState(188);
  const [heightError, setHeightError] = useState("");
  const [avatarSeed, setAvatarSeed] = useState(() => `player-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  
  // Load procedural avatar system
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/avatar.css';
    if (!document.querySelector('link[href="/css/avatar.css"]')) {
      document.head.appendChild(link);
    }
    
    // Initialize player avatar
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import { renderAvatar, dnaFromSeed } from '/js/proc-avatar.js';
      setTimeout(() => {
        document.querySelectorAll('canvas.avatar64').forEach(c => {
          if (c.dataset.seed) {
            c.width = 64; c.height = 64;
            renderAvatar(c, dnaFromSeed(c.dataset.seed));
          }
        });
      }, 100);
    `;
    document.head.appendChild(script);
  }, [avatarSeed]);
  
  const teamsList = teams.get();
  const currentSettings = settings.get();
  const positions = ["PG", "SG", "SF", "PF", "C"];

  // Initialize height from settings
  useEffect(() => {
    setUseMetric(currentSettings.units === 'metric');
  }, [currentSettings.units]);

  // Generate new avatar when team changes
  useEffect(() => {
    setAvatarSeed(`player-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
  }, [playerData.teamId]);

  // Update height when position changes
  useEffect(() => {
    if (playerData.position && heightRanges[playerData.position as keyof typeof heightRanges]) {
      const range = heightRanges[playerData.position as keyof typeof heightRanges];
      const midHeight = Math.floor((range.min + range.max) / 2);
      setPlayerData(prev => ({ ...prev, heightInches: midHeight }));
      
      const feet = Math.floor(midHeight / 12);
      const inches = midHeight % 12;
      setHeightFeet(feet);
      setHeightInches(inches);
      setHeightCm(inchesToCm(midHeight));
    }
  }, [playerData.position]);

  // Update height validation
  useEffect(() => {
    if (!playerData.position) return;
    
    const range = heightRanges[playerData.position as keyof typeof heightRanges];
    if (!range) return;
    
    if (playerData.heightInches < range.min || playerData.heightInches > range.max) {
      const minHeight = inchesToFeetInches(range.min);
      const maxHeight = inchesToFeetInches(range.max);
      setHeightError(`${playerData.position} height must be between ${minHeight} - ${maxHeight}`);
    } else {
      setHeightError("");
    }
  }, [playerData.heightInches, playerData.position]);

  // Handle height changes
  const handleImperialHeightChange = (feet: number, inches: number) => {
    const totalInches = feetInchesToInches(feet, inches);
    setHeightFeet(feet);
    setHeightInches(inches);
    setHeightCm(inchesToCm(totalInches));
    setPlayerData(prev => ({ ...prev, heightInches: totalInches }));
  };

  const handleMetricHeightChange = (cm: number) => {
    const totalInches = cmToInches(cm);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    setHeightCm(cm);
    setHeightFeet(feet);
    setHeightInches(inches);
    setPlayerData(prev => ({ ...prev, heightInches: totalInches }));
  };

  const getAvailableArchetypes = () => {
    if (!playerData.position) return [];
    return getArchetypesForPosition(playerData.position as any);
  };

  // Reset archetype when position changes if it becomes invalid
  useEffect(() => {
    if (playerData.position && playerData.archetype) {
      if (!isValidArchetypeForPosition(playerData.position as any, playerData.archetype)) {
        const availableArchetypes = getArchetypesForPosition(playerData.position as any);
        setPlayerData(prev => ({ 
          ...prev, 
          archetype: availableArchetypes.length > 0 ? availableArchetypes[0] : ""
        }));
      }
    }
  }, [playerData.position]);

  const handleSubmit = () => {
    console.log('Validating player data:', playerData);
    console.log('Validation checks:', {
      firstName: !!playerData.firstName,
      lastName: !!playerData.lastName,
      position: !!playerData.position,
      archetype: !!playerData.archetype,
      teamId: !!playerData.teamId
    });
    
    if (!playerData.firstName || !playerData.lastName || !playerData.position || !playerData.archetype || !playerData.teamId) {
      alert('Please fill in all fields');
      return;
    }
    
    if (heightError) {
      alert('Please fix height validation errors');
      return;
    }
    
    const finalData = {
      nameFirst: playerData.firstName,
      nameLast: playerData.lastName,
      position: playerData.position,
      archetype: playerData.archetype,
      teamId: playerData.teamId,
      heightInches: playerData.heightInches,
      heightCm: inchesToCm(playerData.heightInches),
    };
    
    // Store temporary player data for builder
    localStorage.setItem('hd:tempPlayer', JSON.stringify(finalData));
    
    console.log('Creating player:', finalData);
    onCreatePlayer?.(finalData);
  };

  return (
    <div>
      <main className="px-4 pt-4 pb-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Player</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={playerData.firstName}
                  onChange={(e) => setPlayerData({ ...playerData, firstName: e.target.value })}
                  placeholder="Marcus"
                  data-testid="input-first-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={playerData.lastName}
                  onChange={(e) => setPlayerData({ ...playerData, lastName: e.target.value })}
                  placeholder="Johnson"
                  data-testid="input-last-name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Position</Label>
              <Select value={playerData.position} onValueChange={(value) => setPlayerData({ ...playerData, position: value })}>
                <SelectTrigger data-testid="select-position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos: string) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Archetype</Label>
              <Select value={playerData.archetype} onValueChange={(value) => setPlayerData({ ...playerData, archetype: value })}>
                <SelectTrigger data-testid="select-archetype">
                  <SelectValue placeholder="Select position first" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableArchetypes().map((arch) => (
                    <SelectItem key={arch} value={arch}>{arch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {playerData.position && getAvailableArchetypes().length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Available for {playerData.position}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Team</Label>
              <Select value={playerData.teamId} onValueChange={(value) => setPlayerData({ ...playerData, teamId: value })}>
                <SelectTrigger data-testid="select-team">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teamsList.map((team: any) => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Height</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="height-units" className="text-sm">cm</Label>
                  <Switch
                    id="height-units"
                    checked={!useMetric}
                    onCheckedChange={(checked) => setUseMetric(!checked)}
                  />
                  <Label htmlFor="height-units" className="text-sm">ft/in</Label>
                </div>
              </div>
              
              {useMetric ? (
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={heightCm}
                    onChange={(e) => handleMetricHeightChange(parseInt(e.target.value) || 150)}
                    min="150"
                    max="230"
                    data-testid="input-height-cm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {heightCm} cm / {inchesToFeetInches(playerData.heightInches)}
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="height-feet" className="text-xs">Feet</Label>
                    <Input
                      id="height-feet"
                      type="number"
                      value={heightFeet}
                      onChange={(e) => handleImperialHeightChange(parseInt(e.target.value) || 5, heightInches)}
                      min="5"
                      max="7"
                      data-testid="input-height-feet"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="height-inches" className="text-xs">Inches</Label>
                    <Input
                      id="height-inches"
                      type="number"
                      value={heightInches}
                      onChange={(e) => handleImperialHeightChange(heightFeet, parseInt(e.target.value) || 0)}
                      min="0"
                      max="11"
                      data-testid="input-height-inches"
                    />
                  </div>
                </div>
              )}
              
              {heightError && (
                <Badge variant="destructive" className="text-xs w-full justify-center">
                  {heightError}
                </Badge>
              )}
              
              {!heightError && useMetric && (
                <p className="text-xs text-muted-foreground text-center">
                  {inchesToFeetInches(playerData.heightInches)} / {heightCm} cm
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label>Appearance</Label>
              <div className="flex items-center gap-4">
                <canvas className="avatar64" data-seed={avatarSeed} style={{borderRadius: '8px'}}></canvas>
                <div className="flex-1">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate?.('/customize')}
                    data-testid="button-customize"
                  >
                    Customize
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Customize your player's appearance
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleSubmit}
              data-testid="button-next-player-builder"
            >
              Next: Player Builder
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}