import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import AvatarPreview, { type AppearanceData } from "@/components/AvatarPreview";
import PreGameLayout from "@/layouts/PreGameLayout";

const SKIN_TONES = ['light', 'tan', 'brown', 'dark'] as const;
const HAIR_STYLES = ['short', 'fade', 'afro', 'braids', 'buzz', 'curly'] as const;
const HAIR_COLORS = ['black', 'brown', 'dark-blonde', 'red'] as const;
const FACIAL_HAIR_OPTIONS = ['none', 'goatee', 'stubble'] as const;
const HEADBAND_COLORS = ['#7A5BFF', '#38E1C6', '#FF6B35', '#4CAF50', '#E91E63', '#FF9800'];

interface CustomizeProps {
  onNavigate?: (path: string) => void;
}

export default function Customize({ onNavigate }: CustomizeProps) {
  const [appearance, setAppearance] = useState<AppearanceData>({
    skinTone: 'tan',
    hairStyle: 'short',
    hairColor: 'black',
    facialHair: 'none',
    headband: { on: false, color: '#7A5BFF' }
  });

  useEffect(() => {
    // Load existing appearance data
    const stored = localStorage.getItem('hd:appearance');
    if (stored) {
      try {
        setAppearance(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse stored appearance data:', e);
      }
    }
  }, []);

  const updateAppearance = (updates: Partial<AppearanceData>) => {
    setAppearance(prev => ({ ...prev, ...updates }));
  };

  const saveAppearance = () => {
    localStorage.setItem('hd:appearance', JSON.stringify(appearance));
    onNavigate?.('/new');
  };

  return (
    <PreGameLayout title="Character Creator">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('/new')}
            data-testid="button-back"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-pixel">Character Creator</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <AvatarPreview
                size="large"
                appearance={appearance}
                className="w-32 h-32"
              />
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="space-y-4">
            {/* Skin Tone */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Skin Tone</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {SKIN_TONES.map(tone => (
                  <Button
                    key={tone}
                    variant={appearance.skinTone === tone ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateAppearance({ skinTone: tone })}
                    className="capitalize"
                    data-testid={`skin-${tone}`}
                  >
                    {tone}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Hair Style */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Hair Style</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {HAIR_STYLES.map(style => (
                  <Button
                    key={style}
                    variant={appearance.hairStyle === style ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateAppearance({ hairStyle: style })}
                    className="capitalize"
                    data-testid={`hair-style-${style}`}
                  >
                    {style}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Hair Color */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Hair Color</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {HAIR_COLORS.map(color => (
                  <Button
                    key={color}
                    variant={appearance.hairColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateAppearance({ hairColor: color })}
                    className="capitalize"
                    data-testid={`hair-color-${color}`}
                  >
                    {color.replace('-', ' ')}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Facial Hair */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Facial Hair</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {FACIAL_HAIR_OPTIONS.map(option => (
                  <Button
                    key={option}
                    variant={appearance.facialHair === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateAppearance({ facialHair: option })}
                    className="capitalize"
                    data-testid={`facial-hair-${option}`}
                  >
                    {option}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Headband */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Headband</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    variant={!appearance.headband.on ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateAppearance({ 
                      headband: { ...appearance.headband, on: false } 
                    })}
                    data-testid="headband-off"
                  >
                    Off
                  </Button>
                  <Button
                    variant={appearance.headband.on ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateAppearance({ 
                      headband: { ...appearance.headband, on: true } 
                    })}
                    data-testid="headband-on"
                  >
                    On
                  </Button>
                </div>
                
                {appearance.headband.on && (
                  <div className="flex flex-wrap gap-2">
                    {HEADBAND_COLORS.map(color => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded border-2 ${
                          appearance.headband.color === color 
                            ? 'border-primary' 
                            : 'border-muted-foreground/20'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateAppearance({ 
                          headband: { ...appearance.headband, color } 
                        })}
                        data-testid={`headband-color-${color}`}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => onNavigate?.('/new')}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={saveAppearance}
            data-testid="button-save-appearance"
          >
            Save Appearance
          </Button>
        </div>
      </div>
    </PreGameLayout>
  );
}