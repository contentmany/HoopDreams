import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Shuffle, RotateCcw } from 'lucide-react';
import { useLocation } from 'wouter';
import { CharacterFull } from '@/components/character/CharacterFull';
import { CharacterLook, DEFAULT_CHARACTER_LOOK, SKIN_OPTIONS, HAIR_OPTIONS, BROW_OPTIONS, EYE_OPTIONS, NOSE_OPTIONS, MOUTH_OPTIONS, ACCESSORY_OPTIONS, TEAM_COLORS } from '@/types/character';
import { getDraftPlayer, saveDraftPlayer } from '@/utils/character';
import { player as playerStorage } from '@/utils/localStorage';

interface PlayerName {
  firstName: string;
  lastName: string;
}

export default function Customize() {
  const [, setLocation] = useLocation();
  const [look, setLook] = useState<CharacterLook>(DEFAULT_CHARACTER_LOOK);
  const [playerName, setPlayerName] = useState<PlayerName>({ firstName: '', lastName: '' });

  useEffect(() => {
    // Check if there's an active player first (loaded from save)
    const currentPlayer = playerStorage.get();
    if (currentPlayer && currentPlayer.look) {
      // Load from active saved player
      setLook({
        ...DEFAULT_CHARACTER_LOOK,
        ...currentPlayer.look
      });
      setPlayerName({
        firstName: currentPlayer.nameFirst || '',
        lastName: currentPlayer.nameLast || ''
      });
      return;
    }

    // Load existing draft player data if available
    const draft = getDraftPlayer();
    if (draft) {
      // Migrate legacy appearance to new look structure if needed
      if (draft.appearance && !draft.look) {
        const migratedLook: CharacterLook = {
          skin: 'tan', // Default migration
          hair: 'short',
          brows: 'straight', 
          eyes: 'default',
          nose: 'medium',
          mouth: 'neutral',
          accessory: draft.appearance.accessory === 'headband' ? 'headband' : 'none',
          jerseyColor: TEAM_COLORS.primary,
          shortsColor: TEAM_COLORS.secondary,
          teamNumber: undefined
        };
        setLook(migratedLook);
      } else {
        setLook({
          ...DEFAULT_CHARACTER_LOOK,
          ...draft.look
        });
      }
      setPlayerName({
        firstName: draft.nameFirst || draft.firstName || '',
        lastName: draft.nameLast || draft.lastName || ''
      });
    } else {
      // Load from global character storage if no draft
      const stored = localStorage.getItem('hd:character.look');
      if (stored) {
        try {
          const storedLook = JSON.parse(stored);
          setLook({
            ...DEFAULT_CHARACTER_LOOK,
            ...storedLook
          });
        } catch (e) {
          console.warn('Failed to parse character look data:', e);
        }
      }
    }
  }, []);

  const updateLook = (updates: Partial<CharacterLook>) => {
    const newLook = { ...look, ...updates };
    setLook(newLook);
    
    // If there's an active player, update their look as well
    const currentPlayer = playerStorage.get();
    if (currentPlayer) {
      playerStorage.set({
        ...currentPlayer,
        look: newLook
      });
    }
    
    // Always save to draft player and global storage
    const draft = getDraftPlayer() || {
      nameFirst: playerName.firstName,
      nameLast: playerName.lastName,
      position: 'PG',
      archetype: 'Balanced',
      heightInches: 72,
      heightCm: 183,
      teamId: 'default'
    };
    
    saveDraftPlayer({
      ...draft,
      look: newLook,
      nameFirst: playerName.firstName,
      nameLast: playerName.lastName
    });
    localStorage.setItem('hd:character.look', JSON.stringify(newLook));
  };

  const randomizeLook = () => {
    const randomLook: CharacterLook = {
      skin: SKIN_OPTIONS[Math.floor(Math.random() * SKIN_OPTIONS.length)],
      hair: HAIR_OPTIONS[Math.floor(Math.random() * HAIR_OPTIONS.length)],
      brows: BROW_OPTIONS[Math.floor(Math.random() * BROW_OPTIONS.length)],
      eyes: EYE_OPTIONS[Math.floor(Math.random() * EYE_OPTIONS.length)],
      nose: NOSE_OPTIONS[Math.floor(Math.random() * NOSE_OPTIONS.length)],
      mouth: MOUTH_OPTIONS[Math.floor(Math.random() * MOUTH_OPTIONS.length)],
      accessory: Math.random() < 0.15 ? ACCESSORY_OPTIONS[Math.floor(Math.random() * ACCESSORY_OPTIONS.length)] : 'none',
      jerseyColor: TEAM_COLORS.primary,
      shortsColor: TEAM_COLORS.secondary,
      teamNumber: undefined
    };
    updateLook(randomLook);
  };

  const resetLook = () => {
    updateLook(DEFAULT_CHARACTER_LOOK);
  };

  const handleContinue = () => {
    // Save final data and navigate to builder
    const draft = getDraftPlayer() || {
      position: 'PG',
      archetype: 'Balanced',
      heightInches: 72,
      heightCm: 183,
      teamId: 'default'
    };
    
    saveDraftPlayer({
      ...draft,
      look,
      nameFirst: playerName.firstName,
      nameLast: playerName.lastName
    });
    setLocation('/builder');
  };

  const handleBack = () => {
    setLocation('/new');
  };

  // Helper function to cycle through options
  const cycleOption = <T extends readonly string[]>(
    current: string,
    options: T,
    direction: 'prev' | 'next'
  ): T[number] => {
    const currentIndex = options.indexOf(current as T[number]);
    if (direction === 'next') {
      return options[(currentIndex + 1) % options.length];
    } else {
      return options[(currentIndex - 1 + options.length) % options.length];
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary">Character Creator</h1>
          <p className="text-sm text-muted-foreground">Basketball Life Simulator</p>
        </div>

        {/* Character Preview */}
        <Card className="p-6">
          <div className="flex justify-center">
            <CharacterFull 
              look={look} 
              size="lg" 
              showTeamNumber={false}
              className="bg-gradient-to-b from-card via-card/90 to-card/50"
            />
          </div>
        </Card>

        {/* Character Customization */}
        <Card className="p-4 space-y-4">
          <h3 className="font-semibold text-lg">Appearance</h3>
          
          {/* Skin Tone */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Skin Tone</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ skin: cycleOption(look.skin, SKIN_OPTIONS, 'prev') })}
                data-testid="button-skin-prev"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="min-w-20 text-center text-sm capitalize" data-testid="text-skin-value">
                {look.skin}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ skin: cycleOption(look.skin, SKIN_OPTIONS, 'next') })}
                data-testid="button-skin-next"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Hair Style */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Hair Style</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ hair: cycleOption(look.hair, HAIR_OPTIONS, 'prev') })}
                data-testid="button-hair-prev"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="min-w-20 text-center text-sm capitalize" data-testid="text-hair-value">
                {look.hair}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ hair: cycleOption(look.hair, HAIR_OPTIONS, 'next') })}
                data-testid="button-hair-next"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Eyebrows */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Eyebrows</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ brows: cycleOption(look.brows, BROW_OPTIONS, 'prev') })}
                data-testid="button-brows-prev"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="min-w-20 text-center text-sm capitalize" data-testid="text-brows-value">
                {look.brows}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ brows: cycleOption(look.brows, BROW_OPTIONS, 'next') })}
                data-testid="button-brows-next"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Eyes */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Eyes</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ eyes: cycleOption(look.eyes, EYE_OPTIONS, 'prev') })}
                data-testid="button-eyes-prev"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="min-w-20 text-center text-sm capitalize" data-testid="text-eyes-value">
                {look.eyes}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ eyes: cycleOption(look.eyes, EYE_OPTIONS, 'next') })}
                data-testid="button-eyes-next"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Nose */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Nose</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ nose: cycleOption(look.nose, NOSE_OPTIONS, 'prev') })}
                data-testid="button-nose-prev"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="min-w-20 text-center text-sm capitalize" data-testid="text-nose-value">
                {look.nose}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ nose: cycleOption(look.nose, NOSE_OPTIONS, 'next') })}
                data-testid="button-nose-next"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mouth */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Mouth</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ mouth: cycleOption(look.mouth, MOUTH_OPTIONS, 'prev') })}
                data-testid="button-mouth-prev"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="min-w-20 text-center text-sm capitalize" data-testid="text-mouth-value">
                {look.mouth}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ mouth: cycleOption(look.mouth, MOUTH_OPTIONS, 'next') })}
                data-testid="button-mouth-next"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Accessory */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Accessory</span>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ accessory: cycleOption(look.accessory, ACCESSORY_OPTIONS, 'prev') })}
                data-testid="button-accessory-prev"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="min-w-20 text-center text-sm capitalize" data-testid="text-accessory-value">
                {look.accessory}
              </span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => updateLook({ accessory: cycleOption(look.accessory, ACCESSORY_OPTIONS, 'next') })}
                data-testid="button-accessory-next"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Jersey Color */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Jersey Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={look.jerseyColor}
                onChange={(e) => updateLook({ jerseyColor: e.target.value })}
                className="w-8 h-8 rounded border border-border"
                data-testid="color-jersey"
              />
              <span className="text-xs text-muted-foreground" data-testid="text-jersey-color">
                {look.jerseyColor}
              </span>
            </div>
          </div>

          {/* Shorts Color */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Shorts Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={look.shortsColor}
                onChange={(e) => updateLook({ shortsColor: e.target.value })}
                className="w-8 h-8 rounded border border-border"
                data-testid="color-shorts"
              />
              <span className="text-xs text-muted-foreground" data-testid="text-shorts-color">
                {look.shortsColor}
              </span>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={randomizeLook}
              className="flex-1"
              data-testid="button-randomize"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Randomize
            </Button>
            <Button
              variant="outline"
              onClick={resetLook}
              data-testid="button-reset"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleBack}
            className="flex-1"
            data-testid="button-back"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1"
            data-testid="button-continue"
          >
            Continue to Builder
          </Button>
        </div>
      </div>
    </div>
  );
}