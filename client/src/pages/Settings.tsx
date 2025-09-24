import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings as SettingsIcon, Palette, Volume2, Gamepad2, RotateCcw, Trash2, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import GameHeader from "@/components/GameHeader";
import BottomTabBar from "@/components/BottomTabBar";
import BackLink from "@/components/BackLink";
import { settings, activeSlot, saveSlots, type Settings as SettingsType } from "@/utils/localStorage";
import { difficultySettings } from "@/utils/gameConfig";

interface SettingsProps {
  onNavigateToLoad?: () => void;
  onResetGame?: () => void;
  noSaveMode?: boolean;
}

export default function Settings({ onNavigateToLoad, onResetGame, noSaveMode = false }: SettingsProps) {
  const [currentSettings, setCurrentSettings] = useState<SettingsType>(settings.get());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const saved = settings.get();
    setCurrentSettings(saved);
  }, []);

  const handleSettingChange = (key: keyof SettingsType, value: any) => {
    setCurrentSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    settings.set(currentSettings);
    setHasUnsavedChanges(false);
    
    // Update CSS custom properties for theme color (convert hex to HSL)
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };
    
    document.documentElement.style.setProperty('--primary', hexToHsl(currentSettings.themeColor));
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      themeColor: '#7A5BFF',
      soundOn: true,
      difficulty: 'Normal' as const,
      seasonLength: 'short' as const,
      units: 'imperial' as const,
    };
    setCurrentSettings(defaultSettings);
    setHasUnsavedChanges(true);
  };

  const handleDeleteAllSaves = () => {
    // Clear all save slots
    const slots = saveSlots.get();
    slots.forEach((_, index) => {
      saveSlots.delete(index + 1);
    });
    
    // Clear active slot
    activeSlot.set(null);
    
    // Clear any temp data
    localStorage.removeItem('hd:tempPlayer');
    
    alert('All save data has been deleted.');
  };

  const getDifficultyInfo = (difficulty: string) => {
    const config = difficultySettings[difficulty as keyof typeof difficultySettings] || difficultySettings.Normal;
    return `${config.startingPoints} attribute points, ${Math.round(config.trainingReturn * 100)}% training returns`;
  };

  const themeColors = [
    { name: 'Purple', value: '#7A5BFF' },
    { name: 'Cyan', value: '#38E1C6' },
    { name: 'Orange', value: '#FF6B35' },
    { name: 'Green', value: '#22C55E' },
    { name: 'Amber', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Blue', value: '#06B6D4' },
    { name: 'Pink', value: '#EC4899' },
  ];

  const currentSlot = activeSlot.get();
  const hasActiveSave = currentSlot !== null && !noSaveMode;

  return (
    <div className="min-h-screen bg-background">
      {!noSaveMode && <GameHeader />}
      
      <main className="px-4 pt-4 pb-20 max-w-2xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize your game experience
          </p>
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {themeColors.map((color) => (
                  <Button
                    key={color.value}
                    variant={currentSettings.themeColor === color.value ? "default" : "outline"}
                    className="h-12 flex flex-col gap-1"
                    onClick={() => handleSettingChange('themeColor', color.value)}
                    data-testid={`theme-${color.name.toLowerCase()}`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="units">Units</Label>
              <Select value={currentSettings.units} onValueChange={(value) => handleSettingChange('units', value)}>
                <SelectTrigger data-testid="select-units">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imperial">Imperial (ft/in, lbs)</SelectItem>
                  <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound-toggle">Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Enable game sound effects and audio feedback
                </p>
              </div>
              <Switch
                id="sound-toggle"
                checked={currentSettings.soundOn}
                onCheckedChange={(checked) => handleSettingChange('soundOn', checked)}
                data-testid="toggle-sound"
              />
            </div>
          </CardContent>
        </Card>

        {/* Gameplay - Hidden in no-save mode */}
        {!noSaveMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5" />
              Gameplay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>Difficulty</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Affects starting attribute points, training efficiency, badge requirements, and opponent strength</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <Select 
                value={currentSettings.difficulty} 
                onValueChange={(value) => handleSettingChange('difficulty', value)}
                disabled={hasActiveSave}
              >
                <SelectTrigger data-testid="select-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">
                    <div className="flex items-center justify-between w-full">
                      <span>Easy</span>
                      <Badge variant="secondary" className="ml-2">Casual</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="Normal">
                    <div className="flex items-center justify-between w-full">
                      <span>Normal</span>
                      <Badge variant="outline" className="ml-2">Balanced</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="Hard">
                    <div className="flex items-center justify-between w-full">
                      <span>Hard</span>
                      <Badge variant="destructive" className="ml-2">Challenge</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                <p className="font-medium mb-1">{currentSettings.difficulty} Difficulty:</p>
                <p>{getDifficultyInfo(currentSettings.difficulty)}</p>
                {hasActiveSave && (
                  <p className="text-amber-600 dark:text-amber-400 mt-2 text-xs">
                    Cannot change difficulty with active save game
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Season Length</Label>
              <Select 
                value={currentSettings.seasonLength} 
                onValueChange={(value) => handleSettingChange('seasonLength', value)}
                disabled={hasActiveSave}
              >
                <SelectTrigger data-testid="select-season-length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">
                    <div className="flex items-center justify-between w-full">
                      <span>Short Season</span>
                      <Badge variant="secondary" className="ml-2">14 games</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="standard">
                    <div className="flex items-center justify-between w-full">
                      <span>Standard Season</span>
                      <Badge variant="outline" className="ml-2">20 games</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {hasActiveSave && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Cannot change season length with active save game
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        )}

        {/* Save Management - Hidden in no-save mode */}
        {!noSaveMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Save Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={onNavigateToLoad}
                data-testid="button-manage-saves"
              >
                Manage Save Files
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" data-testid="button-delete-saves">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All Saves
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Save Data</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all save slots and player data. 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAllSaves}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Reset */}
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Reset Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Reset to Defaults</p>
                <p className="text-sm text-muted-foreground">
                  Restore all settings to their default values
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleResetSettings}
                data-testid="button-reset-settings"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        {hasUnsavedChanges && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <p className="text-sm">You have unsaved changes</p>
                  <Button size="sm" onClick={handleSave} data-testid="button-save-settings">
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Back navigation in no-save mode */}
        {noSaveMode && (
          <Card>
            <CardContent className="pt-6">
              <BackLink fallback="/" className="w-full text-center block py-2 px-4 border rounded-lg hover:bg-muted transition-colors" data-testid="button-back-to-menu">
                ← Back
              </BackLink>
            </CardContent>
          </Card>
        )}
      </main>
      
      {!noSaveMode && <BottomTabBar />}
    </div>
  );
}