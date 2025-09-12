import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import GameHeader from "@/components/GameHeader";

interface CreatePlayerProps {
  onCreatePlayer?: (playerData: any) => void;
}

const positions = ["PG", "SG", "SF", "PF", "C"];
const archetypes = ["Pass First", "Shot Creator", "3&D", "Slasher", "Stretch Big", "Rim Protector"];
const teams = [
  { name: "Central High", color: "#7A5BFF" },
  { name: "Westside Prep", color: "#38E1C6" },
  { name: "Riverside Academy", color: "#FF6B35" },
  { name: "Oak Valley", color: "#22C55E" },
  { name: "Pine Ridge", color: "#F59E0B" },
  { name: "Mountain View", color: "#EF4444" },
];

export default function CreatePlayer({ onCreatePlayer }: CreatePlayerProps) {
  const [playerData, setPlayerData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    archetype: "",
    team: "",
    avatarId: 1,
  });

  const [selectedAvatarId, setSelectedAvatarId] = useState(1);

  const handleSubmit = () => {
    if (!playerData.firstName || !playerData.lastName || !playerData.position || !playerData.archetype || !playerData.team) {
      alert('Please fill in all fields');
      return;
    }
    
    const finalData = {
      ...playerData,
      avatarId: selectedAvatarId,
    };
    
    console.log('Creating player:', finalData);
    onCreatePlayer?.(finalData);
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader />
      
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
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Archetype</Label>
              <Select value={playerData.archetype} onValueChange={(value) => setPlayerData({ ...playerData, archetype: value })}>
                <SelectTrigger data-testid="select-archetype">
                  <SelectValue placeholder="Select archetype" />
                </SelectTrigger>
                <SelectContent>
                  {archetypes.map((arch) => (
                    <SelectItem key={arch} value={arch}>{arch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Team</Label>
              <Select value={playerData.team} onValueChange={(value) => setPlayerData({ ...playerData, team: value })}>
                <SelectTrigger data-testid="select-team">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.name} value={team.name}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-3 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
                  <button
                    key={id}
                    onClick={() => setSelectedAvatarId(id)}
                    className={`p-2 rounded-lg border-2 transition-colors hover-elevate ${
                      selectedAvatarId === id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    data-testid={`avatar-${id}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src="/assets/avatars/avatars-collection.png" 
                        alt={`Avatar ${id}`}
                        className="pixel-art"
                      />
                      <AvatarFallback className="font-pixel text-xs">
                        {id}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleSubmit}
              data-testid="button-start-career"
            >
              Start Career
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}