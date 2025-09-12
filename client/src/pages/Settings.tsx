import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Palette, Volume2, Save, AlertTriangle } from "lucide-react";
import GameHeader from "@/components/GameHeader";
import BottomTabBar from "@/components/BottomTabBar";

interface SettingsProps {
  onNavigateToLoad?: () => void;
  onResetGame?: () => void;
}

export default function Settings({ onNavigateToLoad, onResetGame }: SettingsProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("#7A5BFF");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const themeColors = [
    { name: "Court Purple", value: "#7A5BFF" },
    { name: "Electric Teal", value: "#38E1C6" },
    { name: "Basketball Orange", value: "#FF6B35" },
    { name: "Victory Green", value: "#22C55E" },
    { name: "Gold Rush", value: "#F59E0B" },
    { name: "Fire Red", value: "#EF4444" },
  ];

  const handleThemeChange = (color: string) => {
    setSelectedTheme(color);
    document.documentElement.style.setProperty('--primary', `20 85% 55%`);
    console.log('Theme changed to:', color);
  };

  const handleReset = () => {
    setShowResetConfirm(false);
    onResetGame?.();
    console.log('Game reset');
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader />
      
      <main className="px-4 pt-4 pb-20 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme Colors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themeColors.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleThemeChange(theme.value)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors hover-elevate ${
                    selectedTheme === theme.value 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-muted-foreground'
                  }`}
                  data-testid={`theme-${theme.name.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div 
                    className="w-8 h-8 rounded-full mb-2"
                    style={{ backgroundColor: theme.value }}
                  />
                  <span className="text-xs text-center">{theme.name}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Audio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-toggle" className="text-sm font-medium">
                Sound Effects
              </Label>
              <Switch
                id="sound-toggle"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
                data-testid="switch-sound"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Game Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={onNavigateToLoad}
              data-testid="button-manage-saves"
            >
              <Save className="w-4 h-4" />
              Manage Saves
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => setShowResetConfirm(true)}
              data-testid="button-reset-game"
            >
              Reset Game
            </Button>
          </CardContent>
        </Card>
      </main>
      
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-destructive">Reset Game</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This will delete all your progress, saves, and settings. This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowResetConfirm(false)}
                  data-testid="button-cancel-reset"
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={handleReset}
                  data-testid="button-confirm-reset"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <BottomTabBar />
    </div>
  );
}