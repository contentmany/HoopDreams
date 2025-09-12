import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Shuffle, RotateCcw } from 'lucide-react';
import { useLocation } from 'wouter';
import AssetAvatar from '@/components/AssetAvatar';
import { loadAvatarAssets, randomAvatar, AvatarParts } from '@/lib/avatar';

interface AvatarCustomizeNewProps {
  onNavigate?: (path: string) => void;
}

export default function AvatarCustomizeNew({ onNavigate }: AvatarCustomizeNewProps) {
  const [, setLocation] = useLocation();
  
  const [avatarParts, setAvatarParts] = useState<AvatarParts>({
    tone: 'f2',
    eyes: { shape: 'round', color: 'dark_brown' },
    brows: 'straight',
    mouth: 'neutral',
    beard: 'none',
    hair: 'low_cut',
    accessory: 'none'
  });
  
  // Avatar options from improved system
  const manifest = {
    skinTones: [['f1', '#F4C29A'], ['f2', '#E1A06E'], ['f3', '#C77D4C'], ['f4', '#A45B36'], ['f5', '#7A422A']],
    eyes: {
      shapes: ['almond', 'round', 'wide'],
      colors: ['dark_brown']
    },
    hair: ['bald', 'low_cut', 'caesar', 'taper_waves', 'short_waves_deep', 'taper_curl', 'twists_medium', 'twists_long', 'locs_high_bun', 'locs_taper', 'afro_medium_round', 'afro_high_round', 'cornrows_straight', 'cornrows_curve', 'fade_low', 'fade_mid', 'fade_high', 'drop_fade', 'burst_fade']
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeCustomizer() {
      try {
        await loadAvatarAssets();
        
        // Try to load saved appearance
        try {
          const saved = localStorage.getItem('hd:playerAppearance');
          if (saved) {
            const savedParts = JSON.parse(saved);
            setAvatarParts(savedParts);
          }
        } catch (error) {
          console.log('No saved appearance found, using defaults');
        }
      } catch (error) {
        console.error('Failed to initialize avatar customizer:', error);
      } finally {
        setLoading(false);
      }
    }
    
    initializeCustomizer();
  }, []);

  const handlePartChange = (key: string, value: any) => {
    const newParts = { ...avatarParts };
    if (key === 'eyeShape' || key === 'eyeColor') {
      newParts.eyes = { ...newParts.eyes, [key === 'eyeShape' ? 'shape' : 'color']: value };
    } else {
      (newParts as any)[key] = value;
    }
    setAvatarParts(newParts);
  };

  const randomizeAvatar = async () => {
    try {
      const result = await randomAvatar();
      setAvatarParts(result.parts);
    } catch (error) {
      console.error('Failed to randomize avatar:', error);
    }
  };

  const resetAvatar = () => {
    setAvatarParts({
      tone: 'f2',
      expr: 'neutral', 
      eyes: { shape: 'round', color: 'brown' },
      brows: 'straight',
      mouth: 'neutral',
      beard: 'none',
      hair: 'short',
      accessory: 'none'
    });
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('hd:playerAppearance', JSON.stringify(avatarParts));
    
    // Also save to player data if exists
    try {
      const playerData = JSON.parse(localStorage.getItem('player') || '{}');
      playerData.appearance = avatarParts;
      localStorage.setItem('player', JSON.stringify(playerData));
    } catch (error) {
      console.log('Could not save to player data');
    }
    
    // Navigate back
    onNavigate?.('/builder');
    setLocation('/builder');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Loading avatar customizer...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onNavigate?.('/builder') || setLocation('/builder')}
            className="gap-2"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-primary">Customize Appearance</h1>
            <p className="text-sm text-muted-foreground">Basketball Life Simulator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Avatar Preview */}
          <Card className="lg:sticky lg:top-4 h-fit">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <AssetAvatar 
                parts={avatarParts}
                size="s192"
                className="border border-border rounded-lg"
                data-testid="avatar-preview"
              />
            </CardContent>
          </Card>

          {/* Customization Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Skin Tone */}
              <div className="space-y-2">
                <Label className="text-sm">Skin Tone</Label>
                <Select value={avatarParts.tone} onValueChange={(value) => handlePartChange('tone', value)}>
                  <SelectTrigger data-testid="select-skin-tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {manifest.skinTones.map(([code, hex]: [string, string]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-border" 
                            style={{ backgroundColor: hex }}
                          />
                          {code.toUpperCase()}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Eyes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Eye Shape</Label>
                  <Select value={avatarParts.eyes.shape} onValueChange={(value) => handlePartChange('eyeShape', value)}>
                    <SelectTrigger data-testid="select-eye-shape">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {manifest.eyes.shapes.map((shape: string) => (
                        <SelectItem key={shape} value={shape}>
                          {shape.charAt(0).toUpperCase() + shape.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Eye Color</Label>
                  <Select value={avatarParts.eyes.color} onValueChange={(value) => handlePartChange('eyeColor', value)}>
                    <SelectTrigger data-testid="select-eye-color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {manifest.eyes.colors.map((color: string) => (
                        <SelectItem key={color} value={color}>
                          {color.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Hair */}
              <div className="space-y-2">
                <Label className="text-sm">Hair Style</Label>
                <Select value={avatarParts.hair} onValueChange={(value) => handlePartChange('hair', value)}>
                  <SelectTrigger data-testid="select-hair-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {manifest.hair.map((style: string) => (
                      <SelectItem key={style} value={style}>
                        {style.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={randomizeAvatar}
                  className="flex-1 gap-2"
                  data-testid="button-randomize"
                >
                  <Shuffle className="w-4 h-4" />
                  Use Random Look
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetAvatar}
                  className="flex-1 gap-2"
                  data-testid="button-reset"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleSave}
                data-testid="button-save"
              >
                Save Appearance
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}