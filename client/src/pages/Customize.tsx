import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";
import CharacterPreview from "@/components/CharacterPreview";
import { 
  type Appearance, 
  DEFAULT_APPEARANCE, 
  HAIR_STYLE_NAMES, 
  EYE_STYLE_NAMES,
  HEADBAND_NAMES,
  JERSEY_NAMES
} from "@/types/appearance";
import { getDraftPlayer, saveDraftPlayer, generateRandomAppearance } from "@/utils/character";

interface CustomizeProps {
  onNavigate?: (path: string) => void;
}

export default function Customize({ onNavigate }: CustomizeProps) {
  const [, setLocation] = useLocation();
  const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE);
  const [playerName, setPlayerName] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    // Load existing player data if available
    const draft = getDraftPlayer();
    if (draft) {
      setAppearance({
        ...DEFAULT_APPEARANCE,
        ...draft.appearance
      });
      setPlayerName({
        firstName: draft.nameFirst || draft.firstName || '',
        lastName: draft.nameLast || draft.lastName || ''
      });
    } else {
      // Load from global appearance storage if no draft
      const stored = localStorage.getItem('hd:appearance');
      if (stored) {
        try {
          const storedAppearance = JSON.parse(stored);
          setAppearance({
            ...DEFAULT_APPEARANCE,
            ...storedAppearance
          });
        } catch (e) {
          console.warn('Failed to parse appearance data:', e);
        }
      }
    }
  }, []);

  const updateAppearance = (updates: Partial<Appearance>) => {
    const newAppearance = { ...appearance, ...updates };
    setAppearance(newAppearance);
    
    // Save to draft player and global storage
    const draft = getDraftPlayer();
    saveDraftPlayer({
      ...draft,
      nameFirst: playerName.firstName,
      nameLast: playerName.lastName,
      appearance: newAppearance
    });
    localStorage.setItem('hd:appearance', JSON.stringify(newAppearance));
  };

  const updateName = (field: 'firstName' | 'lastName', value: string) => {
    const newName = { ...playerName, [field]: value };
    setPlayerName(newName);
    
    // Save to draft player
    const draft = getDraftPlayer();
    saveDraftPlayer({
      ...draft,
      nameFirst: newName.firstName,
      nameLast: newName.lastName,
      appearance
    });
  };

  const handleRandomize = () => {
    updateAppearance(generateRandomAppearance());
  };

  const handleReset = () => {
    updateAppearance(DEFAULT_APPEARANCE);
  };

  const adjustValue = (key: keyof Appearance, delta: number, max: number) => {
    const current = appearance[key] as number;
    const newValue = Math.max(1, Math.min(max, current + delta));
    updateAppearance({ [key]: newValue });
  };

  const cycleHairColor = (delta: number) => {
    const colors = ['black', 'dark-brown', 'brown', 'blonde', 'red', 'grey'];
    const currentIndex = colors.indexOf(appearance.hairColor);
    const newIndex = (currentIndex + delta + colors.length) % colors.length;
    updateAppearance({ hairColor: colors[newIndex] as any });
  };

  const ControlRow = ({ 
    label, 
    value, 
    onPrevious, 
    onNext, 
    displayValue 
  }: { 
    label: string; 
    value: any; 
    onPrevious: () => void; 
    onNext: () => void; 
    displayValue: string; 
  }) => (
    <div className="flex items-center justify-between py-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onPrevious}
          className="h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="w-20 text-center text-sm font-medium">
          {displayValue}
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onNext}
          className="h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header 
        className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-card-border px-4 py-3" 
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
      >
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-lg font-pixel text-primary">Character Creator</h1>
            <p className="text-xs text-muted-foreground">Basketball Life Simulator</p>
          </div>
        </div>
      </header>

      <main className="px-4 pt-4 pb-8">
        <div className="max-w-md mx-auto space-y-6">
          
          {/* Large Character Preview */}
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <CharacterPreview 
                size="lg" 
                appearance={appearance} 
                teamColor="#7A5BFF"
                className="mx-auto"
              />
            </CardContent>
          </Card>

          {/* Player Name */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Player Name</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={playerName.firstName}
                  onChange={(e) => updateName('firstName', e.target.value)}
                  placeholder="Enter first name"
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={playerName.lastName}
                  onChange={(e) => updateName('lastName', e.target.value)}
                  placeholder="Enter last name"
                  data-testid="input-last-name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Customization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <ControlRow
                label="Skin Tone"
                value={appearance.skinTone}
                onPrevious={() => adjustValue('skinTone', -1, 6)}
                onNext={() => adjustValue('skinTone', 1, 6)}
                displayValue={`${appearance.skinTone}/6`}
              />

              <ControlRow
                label="Hair Style"
                value={appearance.hairStyle}
                onPrevious={() => adjustValue('hairStyle', -1, 10)}
                onNext={() => adjustValue('hairStyle', 1, 10)}
                displayValue={HAIR_STYLE_NAMES[appearance.hairStyle as keyof typeof HAIR_STYLE_NAMES]}
              />

              <ControlRow
                label="Hair Color"
                value={appearance.hairColor}
                onPrevious={() => cycleHairColor(-1)}
                onNext={() => cycleHairColor(1)}
                displayValue={appearance.hairColor.replace('-', ' ')}
              />

              <ControlRow
                label="Eyes"
                value={appearance.eyes}
                onPrevious={() => adjustValue('eyes', -1, 3)}
                onNext={() => adjustValue('eyes', 1, 3)}
                displayValue={EYE_STYLE_NAMES[appearance.eyes as keyof typeof EYE_STYLE_NAMES]}
              />

              <ControlRow
                label="Headband"
                value={appearance.headband}
                onPrevious={() => adjustValue('headband', -1, 4)}
                onNext={() => adjustValue('headband', 1, 4)}
                displayValue={HEADBAND_NAMES[appearance.headband as keyof typeof HEADBAND_NAMES]}
              />

              <ControlRow
                label="Jersey"
                value={appearance.jersey}
                onPrevious={() => adjustValue('jersey', -1, 4)}
                onNext={() => adjustValue('jersey', 1, 4)}
                displayValue={JERSEY_NAMES[appearance.jersey as keyof typeof JERSEY_NAMES]}
              />

              {/* Accessories Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-3">Accessories</h3>
                
                {/* Headband Toggle */}
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm font-medium">Headband</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={appearance.accessory === 'headband'}
                      onChange={(e) => updateAppearance({ 
                        accessory: e.target.checked ? 'headband' : null 
                      })}
                      className="w-4 h-4"
                      data-testid="toggle-headband"
                    />
                  </div>
                </div>

                {/* Color Picker - only show when headband is enabled */}
                {appearance.accessory === 'headband' && (
                  <div className="flex items-center justify-between py-2">
                    <Label className="text-sm font-medium">Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={appearance.accessoryColor}
                        onChange={(e) => updateAppearance({ accessoryColor: e.target.value })}
                        className="w-8 h-8 rounded border border-gray-300"
                        data-testid="color-headband"
                      />
                      <div className="text-xs text-muted-foreground">
                        {appearance.accessoryColor}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleRandomize}
                  className="flex-1"
                  data-testid="button-randomize"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Randomize
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex-1"
                  data-testid="button-reset"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/')}
              className="flex-1"
              data-testid="button-main-menu"
            >
              Main Menu
            </Button>
            <Button 
              onClick={() => setLocation('/builder')}
              className="flex-1"
              data-testid="button-continue-builder"
            >
              Continue to Builder
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}