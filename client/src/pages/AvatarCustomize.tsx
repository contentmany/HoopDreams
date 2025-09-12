import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Shuffle, RotateCcw } from 'lucide-react';
import { useLocation } from 'wouter';
import { Avatar } from '@/components/Avatar';
import { AvatarData, DEFAULT_AVATAR, SKIN_TONE_OPTIONS, HAIR_STYLE_OPTIONS, EYE_OPTIONS, BROW_OPTIONS, NOSE_OPTIONS, MOUTH_OPTIONS, FACIAL_HAIR_OPTIONS } from '@/types/avatar';
import { avatarStorage } from '@/utils/avatarStorage';

interface AvatarCustomizeProps {
  onNavigate?: (path: string) => void;
}

export default function AvatarCustomize({ onNavigate }: AvatarCustomizeProps) {
  const [, setLocation] = useLocation();
  const [avatarData, setAvatarData] = useState<AvatarData>(() => avatarStorage.get());

  const updateAvatar = (updates: Partial<AvatarData>) => {
    const newAvatarData = { ...avatarData, ...updates };
    setAvatarData(newAvatarData);
    avatarStorage.set(newAvatarData);
  };

  const randomizeAvatar = () => {
    const randomChoice = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
    
    const randomAvatar: AvatarData = {
      skinTone: randomChoice(SKIN_TONE_OPTIONS),
      hairStyle: randomChoice(HAIR_STYLE_OPTIONS),
      hairColor: randomChoice(['#4a3728', '#2d1b14', '#8b6914', '#d4b852', '#c95429', '#000000']),
      eyes: randomChoice(EYE_OPTIONS),
      brows: randomChoice(BROW_OPTIONS),
      nose: randomChoice(NOSE_OPTIONS),
      mouth: randomChoice(MOUTH_OPTIONS),
      facialHair: randomChoice(FACIAL_HAIR_OPTIONS),
      headband: {
        on: Math.random() < 0.15,
        color: avatarData.headband.color
      },
      jerseyColor: avatarData.jerseyColor,
      shortsColor: avatarData.shortsColor,
      shoesColor: randomChoice(['#ffffff', '#000000', avatarData.jerseyColor])
    };
    
    updateAvatar(randomAvatar);
  };

  const resetAvatar = () => {
    updateAvatar(DEFAULT_AVATAR);
  };

  const handleSave = () => {
    onNavigate?.('/new');
  };

  const handleBack = () => {
    onNavigate?.('/new');
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <main className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleBack}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Character Creator</h1>
            <p className="text-sm text-muted-foreground">Customize your player's appearance</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Avatar stageSize="md" avatarData={avatarData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skin Tone */}
            <div className="space-y-2">
              <Label>Skin Tone</Label>
              <Select value={avatarData.skinTone} onValueChange={(value) => updateAvatar({ skinTone: value })}>
                <SelectTrigger data-testid="select-skin-tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SKIN_TONE_OPTIONS.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hair Style */}
            <div className="space-y-2">
              <Label>Hair Style</Label>
              <Select value={avatarData.hairStyle} onValueChange={(value) => updateAvatar({ hairStyle: value })}>
                <SelectTrigger data-testid="select-hair-style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HAIR_STYLE_OPTIONS.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hair Color */}
            <div className="space-y-2">
              <Label>Hair Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={avatarData.hairColor}
                  onChange={(e) => updateAvatar({ hairColor: e.target.value })}
                  className="w-8 h-8 rounded border border-border"
                  data-testid="color-hair"
                />
                <span className="text-xs text-muted-foreground">{avatarData.hairColor}</span>
              </div>
            </div>

            <Separator />

            {/* Facial Features */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Facial Features</Label>
              
              {/* Eyes */}
              <div className="space-y-2">
                <Label className="text-sm">Eyes</Label>
                <Select value={avatarData.eyes} onValueChange={(value) => updateAvatar({ eyes: value })}>
                  <SelectTrigger data-testid="select-eyes">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EYE_OPTIONS.map((eye) => (
                      <SelectItem key={eye} value={eye}>
                        {eye.charAt(0).toUpperCase() + eye.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brows */}
              <div className="space-y-2">
                <Label className="text-sm">Brows</Label>
                <Select value={avatarData.brows} onValueChange={(value) => updateAvatar({ brows: value })}>
                  <SelectTrigger data-testid="select-brows">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BROW_OPTIONS.map((brow) => (
                      <SelectItem key={brow} value={brow}>
                        {brow.charAt(0).toUpperCase() + brow.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Nose */}
              <div className="space-y-2">
                <Label className="text-sm">Nose</Label>
                <Select value={avatarData.nose} onValueChange={(value) => updateAvatar({ nose: value })}>
                  <SelectTrigger data-testid="select-nose">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOSE_OPTIONS.map((nose) => (
                      <SelectItem key={nose} value={nose}>
                        {nose.charAt(0).toUpperCase() + nose.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mouth */}
              <div className="space-y-2">
                <Label className="text-sm">Mouth</Label>
                <Select value={avatarData.mouth} onValueChange={(value) => updateAvatar({ mouth: value })}>
                  <SelectTrigger data-testid="select-mouth">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOUTH_OPTIONS.map((mouth) => (
                      <SelectItem key={mouth} value={mouth}>
                        {mouth.charAt(0).toUpperCase() + mouth.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Facial Hair */}
              <div className="space-y-2">
                <Label className="text-sm">Facial Hair</Label>
                <Select value={avatarData.facialHair} onValueChange={(value) => updateAvatar({ facialHair: value })}>
                  <SelectTrigger data-testid="select-facial-hair">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FACIAL_HAIR_OPTIONS.map((hair) => (
                      <SelectItem key={hair} value={hair}>
                        {hair === 'none' ? 'None' : hair.charAt(0).toUpperCase() + hair.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Accessories */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Accessories</Label>
              
              {/* Headband */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Headband</Label>
                  <Switch
                    checked={avatarData.headband.on}
                    onCheckedChange={(checked) => updateAvatar({ 
                      headband: { ...avatarData.headband, on: checked } 
                    })}
                    data-testid="switch-headband"
                  />
                </div>
                {avatarData.headband.on && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={avatarData.headband.color}
                      onChange={(e) => updateAvatar({ 
                        headband: { ...avatarData.headband, color: e.target.value } 
                      })}
                      className="w-8 h-8 rounded border border-border"
                      data-testid="color-headband"
                    />
                    <span className="text-xs text-muted-foreground">{avatarData.headband.color}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Colors */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Team Colors</Label>
              
              {/* Jersey Color */}
              <div className="space-y-2">
                <Label className="text-sm">Jersey Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={avatarData.jerseyColor}
                    onChange={(e) => updateAvatar({ jerseyColor: e.target.value })}
                    className="w-8 h-8 rounded border border-border"
                    data-testid="color-jersey"
                  />
                  <span className="text-xs text-muted-foreground">{avatarData.jerseyColor}</span>
                </div>
              </div>

              {/* Shorts Color */}
              <div className="space-y-2">
                <Label className="text-sm">Shorts Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={avatarData.shortsColor}
                    onChange={(e) => updateAvatar({ shortsColor: e.target.value })}
                    className="w-8 h-8 rounded border border-border"
                    data-testid="color-shorts"
                  />
                  <span className="text-xs text-muted-foreground">{avatarData.shortsColor}</span>
                </div>
              </div>

              {/* Shoes Color */}
              <div className="space-y-2">
                <Label className="text-sm">Shoes Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={avatarData.shoesColor}
                    onChange={(e) => updateAvatar({ shoesColor: e.target.value })}
                    className="w-8 h-8 rounded border border-border"
                    data-testid="color-shoes"
                  />
                  <span className="text-xs text-muted-foreground">{avatarData.shoesColor}</span>
                </div>
              </div>
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
                Randomize
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
              Save & Continue
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}