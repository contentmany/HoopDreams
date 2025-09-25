import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';
import { useGameStore } from '@/state/gameStore';
import AvatarPhoto from '@/components/AvatarPhoto';
import type { AttributeSet } from '@/types';

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
  const { getBuilderDraft, saveBuilderDraft, applyBuilderDraft, career } = useGameStore();
  
  const [attributes, setAttributes] = useState<BuilderAttributes>(DEFAULT_BUILDER_ATTRIBUTES);
  const [availablePoints, setAvailablePoints] = useState(20);

  // Get player info from career (set on New Career screen)
  const player = career.player;
  const fullName = `${player.firstName} ${player.lastName}`.trim() || "Your Name";
  const heightInches = 72; // Default height
  const feet = Math.floor(heightInches / 12);
  const inches = heightInches % 12;
  const heightLabel = `${feet}'${inches}" (${Math.round(heightInches * 2.54)}cm)`;

  useEffect(() => {
    // Load draft attributes only
    const draft = getBuilderDraft();
    if (draft && draft.attributes) {
      // Map the attributes properly
      const draftAttributes = draft.attributes as any;
      if (draftAttributes.finishing !== undefined) {
        setAttributes({
          finishing: draftAttributes.finishing || 60,
          shooting: draftAttributes.shooting || 55,
          playmaking: draftAttributes.playmaking || 50,
          rebounding: draftAttributes.rebounding || 45,
          defense: draftAttributes.defense || 40,
          physicals: draftAttributes.physicals || 65
        });
      }
    }
  }, [getBuilderDraft]);

  // Save draft when attributes change
  useEffect(() => {
    saveBuilderDraft({
      firstName: player.firstName,
      lastName: player.lastName,
      position: player.position,
      archetype: player.archetype,
      attributes
    });
  }, [attributes, saveBuilderDraft, player]);

  const adjustAttribute = (attr: keyof BuilderAttributes, delta: number) => {
    const newValue = Math.max(25, Math.min(99, attributes[attr] + delta));
    const actualDelta = newValue - attributes[attr];
    
    if (actualDelta > 0 && availablePoints < actualDelta) return;
    
    setAttributes(prev => ({ ...prev, [attr]: newValue }));
    setAvailablePoints(prev => prev - actualDelta);
  };

  const handleStartCareer = () => {
    // Apply the builder draft to create the new career
    applyBuilderDraft();

    // Navigate to dashboard (home route)
    setLocation('/home');
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
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Single header (no duplicates) */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-primary">Player Builder</h1>
        <p className="text-sm text-muted-foreground">Basketball Life Simulator</p>
      </header>

      {/* Character Preview (photo + identity). No Player Information form here. */}
      <section className="mb-6 rounded-xl bg-card border border-border p-4">
        <h2 className="text-xl font-semibold mb-3">Character Preview</h2>
        <div className="flex items-center gap-4">
          <AvatarPhoto size={72} />
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                {player.position}
              </Badge>
              <span className="text-sm text-muted-foreground">{player.archetype}</span>
              <span className="text-sm text-muted-foreground">{heightLabel}</span>
            </div>
            <div className="text-2xl font-semibold">{fullName}</div>
            <p className="text-xs text-muted-foreground mt-1">Procedural avatar</p>
          </div>
        </div>
      </section>

      {/* Attributes section */}
      <section className="rounded-xl bg-card border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Attributes</h2>
          <Badge variant="outline" data-testid="text-available-points">
            {availablePoints} points available
          </Badge>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(attributes).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {attributeLabels[key as keyof BuilderAttributes]}
                </span>
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
        </div>
      </section>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={() => setLocation('/new')}
          className="flex-1"
          data-testid="button-back"
        >
          Back to Customize
        </Button>
        <Button
          onClick={handleStartCareer}
          className="flex-1"
          data-testid="button-start-career"
        >
          Start Career
        </Button>
      </div>
    </div>
  );
}