import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Shuffle, RotateCcw } from 'lucide-react';
import { useLocation } from 'wouter';
import HeadAvatar from '@/components/HeadAvatar';
import type { AvatarDNA } from '@/avatar/types';
import { 
  SKIN_TONES, 
  EYE_COLORS, 
  EYE_SHAPES, 
  BROW_STYLES, 
  HAIR_STYLES, 
  FACIAL_HAIR_STYLES, 
  HEAD_GEAR_OPTIONS, 
  ACCENT_OPTIONS 
} from '@/avatar/types';
import { dnaFromSeed, mergeDNA } from '@/avatar/factory';
import { hairPalette, headGearColorPalette } from '@/avatar/colors';

interface AvatarCustomizeProps {
  onNavigate?: (path: string) => void;
}

export default function AvatarCustomize({ onNavigate }: AvatarCustomizeProps) {
  const [, setLocation] = useLocation();
  
  // Initialize with a default avatar
  const [avatarDNA, setAvatarDNA] = useState<AvatarDNA>(() => {
    // Try to load from localStorage first
    try {
      const saved = localStorage.getItem('hd:playerAvatarDNA');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.log('No saved avatar DNA, using default');
    }
    return dnaFromSeed(Date.now());
  });

  const updateDNA = (updates: Partial<AvatarDNA>) => {
    const newDNA = mergeDNA(avatarDNA, updates);
    setAvatarDNA(newDNA);
    localStorage.setItem('hd:playerAvatarDNA', JSON.stringify(newDNA));
  };

  const randomizeAvatar = () => {
    const newDNA = dnaFromSeed(Date.now());
    setAvatarDNA(newDNA);
    localStorage.setItem('hd:playerAvatarDNA', JSON.stringify(newDNA));
  };

  const resetAvatar = () => {
    const defaultDNA = dnaFromSeed(0);
    setAvatarDNA(defaultDNA);
    localStorage.setItem('hd:playerAvatarDNA', JSON.stringify(defaultDNA));
  };

  const handleSave = () => {
    // Save avatar DNA to player data
    try {
      const playerData = JSON.parse(localStorage.getItem('player') || '{}');
      playerData.avatarDNA = avatarDNA;
      localStorage.setItem('player', JSON.stringify(playerData));
    } catch (error) {
      console.log('Could not save to player data');
    }
    
    // Navigate back to builder or wherever appropriate
    onNavigate?.('/builder');
    setLocation('/builder');
  };

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
              <HeadAvatar 
                dna={avatarDNA} 
                variant="2xl"
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
                <Select value={avatarDNA.skin} onValueChange={(value) => updateDNA({ skin: value as any })}>
                  <SelectTrigger data-testid="select-skin">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SKIN_TONES.map((skin) => (
                      <SelectItem key={skin} value={skin}>
                        {skin.charAt(0).toUpperCase() + skin.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Hair Style */}
              <div className="space-y-2">
                <Label className="text-sm">Hair Style</Label>
                <Select value={avatarDNA.hairStyle} onValueChange={(value) => updateDNA({ hairStyle: value as any })}>
                  <SelectTrigger data-testid="select-hair-style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HAIR_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style === 'afroLow' ? 'Afro (Low)' : 
                         style === 'afroHigh' ? 'Afro (High)' :
                         style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Hair Color */}
              <div className="space-y-2">
                <Label className="text-sm">Hair Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={avatarDNA.hairColor}
                    onChange={(e) => updateDNA({ hairColor: e.target.value })}
                    className="w-8 h-8 rounded border border-border"
                    data-testid="color-hair"
                  />
                  <Select value={avatarDNA.hairColor} onValueChange={(value) => updateDNA({ hairColor: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hairPalette.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-border" 
                              style={{ backgroundColor: color }}
                            />
                            {color}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Eye Color */}
              <div className="space-y-2">
                <Label className="text-sm">Eye Color</Label>
                <Select value={avatarDNA.eyeColor} onValueChange={(value) => updateDNA({ eyeColor: value as any })}>
                  <SelectTrigger data-testid="select-eye-color">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EYE_COLORS.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color === 'darkBrown' ? 'Dark Brown' : 
                         color.charAt(0).toUpperCase() + color.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Eye Shape */}
              <div className="space-y-2">
                <Label className="text-sm">Eye Shape</Label>
                <Select value={avatarDNA.eyeShape} onValueChange={(value) => updateDNA({ eyeShape: value as any })}>
                  <SelectTrigger data-testid="select-eye-shape">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EYE_SHAPES.map((shape) => (
                      <SelectItem key={shape} value={shape}>
                        {shape.charAt(0).toUpperCase() + shape.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brows */}
              <div className="space-y-2">
                <Label className="text-sm">Brows</Label>
                <Select value={avatarDNA.brow} onValueChange={(value) => updateDNA({ brow: value as any })}>
                  <SelectTrigger data-testid="select-brows">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BROW_STYLES.map((brow) => (
                      <SelectItem key={brow} value={brow}>
                        {brow.charAt(0).toUpperCase() + brow.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Facial Hair */}
              <div className="space-y-2">
                <Label className="text-sm">Facial Hair</Label>
                <Select value={avatarDNA.facialHair} onValueChange={(value) => updateDNA({ facialHair: value as any })}>
                  <SelectTrigger data-testid="select-facial-hair">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FACIAL_HAIR_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style === 'beardShort' ? 'Beard (Short)' :
                         style === 'beardFull' ? 'Beard (Full)' :
                         style === 'none' ? 'None' :
                         style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Head Gear */}
              <div className="space-y-2">
                <Label className="text-sm">Head Gear</Label>
                <Select value={avatarDNA.headGear} onValueChange={(value) => updateDNA({ headGear: value as any })}>
                  <SelectTrigger data-testid="select-headgear">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HEAD_GEAR_OPTIONS.map((gear) => (
                      <SelectItem key={gear} value={gear}>
                        {gear === 'none' ? 'None' : 
                         gear.charAt(0).toUpperCase() + gear.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Head Gear Color */}
              {avatarDNA.headGear !== 'none' && (
                <div className="space-y-2">
                  <Label className="text-sm">Head Gear Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={avatarDNA.headGearColor || '#ffffff'}
                      onChange={(e) => updateDNA({ headGearColor: e.target.value })}
                      className="w-8 h-8 rounded border border-border"
                      data-testid="color-headgear"
                    />
                    <Select 
                      value={avatarDNA.headGearColor || '#ffffff'} 
                      onValueChange={(value) => updateDNA({ headGearColor: value })}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {headGearColorPalette.map((color) => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border border-border" 
                                style={{ backgroundColor: color }}
                              />
                              {color}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Accents */}
              <div className="space-y-2">
                <Label className="text-sm">Accessories</Label>
                <Select value={avatarDNA.accent} onValueChange={(value) => updateDNA({ accent: value as any })}>
                  <SelectTrigger data-testid="select-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCENT_OPTIONS.map((accent) => (
                      <SelectItem key={accent} value={accent}>
                        {accent === 'none' ? 'None' :
                         accent === 'earringL' ? 'Earring (Left)' :
                         accent === 'earringR' ? 'Earring (Right)' :
                         accent === 'earringBoth' ? 'Earrings (Both)' :
                         accent}
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