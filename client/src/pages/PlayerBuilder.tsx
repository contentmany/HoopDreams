import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useLocation } from 'wouter';
import { getDraftPlayer, saveDraftPlayer } from '@/utils/character';
import { type Player, saveSlots, activeSlot } from '@/utils/localStorage';

interface BuilderAttributes {
  finishing: number;
  shooting: number;
  playmaking: number;
  rebounding: number;
  defense: number;
  physicals: number;
}

const DEFAULT_BUILDER_ATTRIBUTES: BuilderAttributes = {
  finishing: 60,
  shooting: 55,
  playmaking: 50,
  rebounding: 45,
  defense: 40,
  physicals: 65
};

export default function PlayerBuilder() {
  const [, setLocation] = useLocation();
  // Avatar handled by procedural system
  const [playerName, setPlayerName] = useState({ firstName: '', lastName: '' });
  const [position, setPosition] = useState('PG');
  const [archetype, setArchetype] = useState('Balanced');
  const [height, setHeight] = useState({ inches: 72, cm: 183 });
  const [attributes, setAttributes] = useState<BuilderAttributes>(DEFAULT_BUILDER_ATTRIBUTES);
  const [availablePoints, setAvailablePoints] = useState(20);

  useEffect(() => {
    // Load draft player data
    const draft = getDraftPlayer();
    if (draft) {
      setPlayerName({
        firstName: draft.nameFirst || draft.firstName || '',
        lastName: draft.nameLast || draft.lastName || ''
      });
      setPosition(draft.position || 'PG');
      setArchetype(draft.archetype || 'Balanced');
      if (draft.heightInches) {
        setHeight({
          inches: draft.heightInches,
          cm: draft.heightCm || Math.round(draft.heightInches * 2.54)
        });
      }
      if (draft.attributes) {
        setAttributes(draft.attributes);
      }
    }
  }, []);

  const adjustAttribute = (attr: keyof BuilderAttributes, delta: number) => {
    const newValue = Math.max(25, Math.min(99, attributes[attr] + delta));
    const actualDelta = newValue - attributes[attr];
    
    if (actualDelta > 0 && availablePoints < actualDelta) return;
    
    setAttributes(prev => ({ ...prev, [attr]: newValue }));
    setAvailablePoints(prev => prev - actualDelta);
  };

  const handleStartCareer = () => {
    // Convert BuilderAttributes to full Attributes
    const fullAttributes = {
      // Shooting
      close: attributes.finishing,
      mid: attributes.shooting,
      three: attributes.shooting,
      freeThrow: attributes.shooting,
      // Finishing  
      drivingLayup: attributes.finishing,
      drivingDunk: attributes.finishing,
      postControl: attributes.finishing,
      // Playmaking
      passAccuracy: attributes.playmaking,
      ballHandle: attributes.playmaking,
      speedWithBall: attributes.playmaking,
      // Defense
      interiorD: attributes.defense,
      perimeterD: attributes.defense,
      steal: attributes.defense,
      block: attributes.defense,
      oReb: attributes.rebounding,
      dReb: attributes.rebounding,
      // Physicals
      speed: attributes.physicals,
      acceleration: attributes.physicals,
      strength: attributes.physicals,
      vertical: attributes.physicals,
      stamina: attributes.physicals
    };

    // Avatar will be handled by procedural system

    // Create final player object
    const finalPlayer: Partial<Player> = {
      nameFirst: playerName.firstName,
      nameLast: playerName.lastName,
      position,
      archetype,
      heightInches: height.inches,
      heightCm: height.cm,
      teamId: 'user-team', // Default team
      year: 1,
      week: 1,
      age: 18,
      attributes: fullAttributes,
      badgePoints: 0,
      badges: [],
      milestones: {
        threeMade: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        dunks: 0,
        stops: 0,
        deepThrees: 0
      },
      energy: 100,
      mood: 80,
      clout: 0,
      chemistry: 50,
      health: 100,
      reputation: 0,
      seasonCapUsed: 0
    };

    // Save to slot 1 and set as active
    saveSlots.save(1, finalPlayer as Player);
    activeSlot.set(1);

    // Navigate to dashboard (home route)
    setLocation('/home');
  };

  const handleBack = () => {
    setLocation('/avatar-photo');
  };

  const getAttributeColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 70) return 'bg-yellow-500';
    if (value >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const attributeLabels: Record<keyof BuilderAttributes, string> = {
    finishing: 'Finishing',
    shooting: 'Shooting',
    playmaking: 'Playmaking',
    rebounding: 'Rebounding',
    defense: 'Defense',
    physicals: 'Physicals'
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">Player Builder</h1>
          <p className="text-sm text-muted-foreground">Basketball Life Simulator</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Character Preview */}
          <Card className="lg:sticky lg:top-4 h-fit">
            <CardHeader>
              <CardTitle>Character Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <canvas className="avatar96" data-seed="player-builder-default" style={{borderRadius: '50%'}}></canvas>
                  <p className="text-xs text-muted-foreground">Procedural avatar</p>
                </div>
              </div>
              
              <div className="text-center space-y-1">
                <h3 className="font-semibold text-lg" data-testid="text-player-name">
                  {playerName.firstName} {playerName.lastName}
                </h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="secondary">{position}</Badge>
                  <Badge variant="outline">{archetype}</Badge>
                  <Badge variant="outline">
                    {Math.floor(height.inches / 12)}'{height.inches % 12}" ({height.cm}cm)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attributes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Attributes
                  <Badge variant="outline" data-testid="text-available-points">
                    {availablePoints} points available
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        {attributeLabels[key as keyof BuilderAttributes]}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustAttribute(key as keyof BuilderAttributes, -1)}
                          disabled={value <= 25}
                          data-testid={`button-${key}-decrease`}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-mono" data-testid={`text-${key}-value`}>
                          {value}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => adjustAttribute(key as keyof BuilderAttributes, 1)}
                          disabled={value >= 99 || availablePoints <= 0}
                          data-testid={`button-${key}-increase`}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={value} 
                        max={99}
                        className="h-2"
                      />
                      <div 
                        className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getAttributeColor(value)}`}
                        style={{ width: `${(value / 99) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Player Info */}
            <Card>
              <CardHeader>
                <CardTitle>Player Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={playerName.firstName}
                      onChange={(e) => setPlayerName(prev => ({ ...prev, firstName: e.target.value }))}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={playerName.lastName}
                      onChange={(e) => setPlayerName(prev => ({ ...prev, lastName: e.target.value }))}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Position</Label>
                    <div className="text-sm text-muted-foreground mt-1" data-testid="text-position">
                      {position}
                    </div>
                  </div>
                  <div>
                    <Label>Archetype</Label>
                    <div className="text-sm text-muted-foreground mt-1" data-testid="text-archetype">
                      {archetype}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleBack}
                className="flex-1"
                data-testid="button-back"
              >
                Back to Customize
              </Button>
              <Button
                onClick={handleStartCareer}
                className="flex-1"
                disabled={!playerName.firstName || !playerName.lastName}
                data-testid="button-start-career"
              >
                Start Career
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}