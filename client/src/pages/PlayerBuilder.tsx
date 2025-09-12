import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Minus, HelpCircle, RotateCcw } from "lucide-react";
import GameHeader from "@/components/GameHeader";
import { 
  getAttributeCaps, 
  calculateOVR, 
  difficultySettings,
  badges,
  inchesToFeetInches 
} from "@/utils/gameConfig";
import { settings, activeSlot, player as playerStorage, createDefaultAttributes } from "@/utils/localStorage";
import type { Attributes, Player } from "@/utils/localStorage";

interface PlayerBuilderProps {
  onSaveBuild?: () => void;
}

export default function PlayerBuilder({ onSaveBuild }: PlayerBuilderProps) {
  const [attributes, setAttributes] = useState<Attributes>(createDefaultAttributes());
  const [availablePoints, setAvailablePoints] = useState(250);
  const [playerInfo, setPlayerInfo] = useState<Partial<Player>>({});
  const [attributeCaps, setAttributeCaps] = useState<Partial<Attributes>>({});

  const currentSettings = settings.get();
  const difficulty = difficultySettings[currentSettings.difficulty];
  const maxPoints = difficulty.startingPoints;

  useEffect(() => {
    // Load player data from localStorage
    const currentPlayer = playerStorage.get();
    if (currentPlayer) {
      setPlayerInfo(currentPlayer);
      setAttributeCaps(getAttributeCaps(currentPlayer.position, currentPlayer.heightInches));
    }
  }, []);

  useEffect(() => {
    // Calculate available points
    const usedPoints = Object.values(attributes).reduce((sum, val) => sum + Math.max(0, val - 25), 0);
    setAvailablePoints(maxPoints - usedPoints);
  }, [attributes, maxPoints]);

  const adjustAttribute = (attr: keyof Attributes, delta: number) => {
    setAttributes(prev => {
      const currentValue = prev[attr];
      const newValue = Math.max(25, Math.min(99, currentValue + delta));
      const cap = attributeCaps[attr] || 99;
      
      return {
        ...prev,
        [attr]: Math.min(newValue, cap)
      };
    });
  };

  const resetAttributes = () => {
    setAttributes(createDefaultAttributes());
  };

  const canIncrease = (attr: keyof Attributes) => {
    const currentValue = attributes[attr];
    const cap = attributeCaps[attr] || 99;
    return currentValue < cap && currentValue < 99 && availablePoints > 0;
  };

  const canDecrease = (attr: keyof Attributes) => {
    return attributes[attr] > 25;
  };

  const getOVR = () => {
    if (!playerInfo.position) return 0;
    return Math.min(65, calculateOVR(attributes, playerInfo.position));
  };

  const getAvailableBadges = () => {
    return badges.filter(badge => {
      let attributeValue = 0;
      
      if (badge.attributeKey === 'calculated') {
        // Handle calculated badges
        switch (badge.id) {
          case 'green-machine':
            attributeValue = attributes.three + ((playerInfo.mood || 7) / 10) * 10;
            break;
          case 'fearless-finisher':
            attributeValue = (attributes.drivingLayup + attributes.strength) / 2;
            break;
          case 'putback-boss':
            attributeValue = (attributes.oReb + attributes.drivingDunk) / 2;
            break;
          case 'unpluckable':
            attributeValue = (attributes.ballHandle + attributes.strength) / 2;
            break;
          case 'boxout-beast':
            attributeValue = (attributes.strength + attributes.dReb) / 2;
            break;
          default:
            return false;
        }
      } else {
        attributeValue = attributes[badge.attributeKey];
      }

      // Apply difficulty scaling
      const scaledThresholds = {
        Bronze: Math.round(badge.thresholds.Bronze * difficulty.badgeThresholdScale),
        Silver: Math.round(badge.thresholds.Silver * difficulty.badgeThresholdScale),
        Gold: Math.round(badge.thresholds.Gold * difficulty.badgeThresholdScale),
        HOF: Math.round(badge.thresholds.HOF * difficulty.badgeThresholdScale),
      };

      let availableTier: 'Bronze' | 'Silver' | 'Gold' | 'HOF' | null = null;
      
      if (attributeValue >= scaledThresholds.HOF) availableTier = 'HOF';
      else if (attributeValue >= scaledThresholds.Gold) availableTier = 'Gold';
      else if (attributeValue >= scaledThresholds.Silver) availableTier = 'Silver';
      else if (attributeValue >= scaledThresholds.Bronze) availableTier = 'Bronze';
      
      return availableTier ? { ...badge, availableTier, attributeValue } : null;
    }).filter(Boolean);
  };

  const handleSaveBuild = () => {
    if (!playerInfo.nameFirst) {
      alert('Player data not found');
      return;
    }

    const finalPlayer: Player = {
      ...playerInfo as Player,
      attributes,
      badgePoints: difficulty.startingBadgePoints,
      badges: [],
      year: 2026,
      week: 1,
      age: 14,
      energy: 10,
      mood: 7,
      clout: 5,
      chemistry: 50,
      health: 100,
      reputation: 0,
      seasonCapUsed: 0,
      milestones: {
        threeMade: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        dunks: 0,
        stops: 0,
        deepThrees: 0,
      },
    };

    playerStorage.set(finalPlayer);
    console.log('Player build saved:', finalPlayer);
    onSaveBuild?.();
  };

  const attributeCategories = {
    'SHOOTING': ['close', 'mid', 'three', 'freeThrow'],
    'FINISHING': ['drivingLayup', 'drivingDunk', 'postControl'],
    'PLAYMAKING': ['passAccuracy', 'ballHandle', 'speedWithBall'],
    'DEFENSE': ['interiorD', 'perimeterD', 'steal', 'block', 'oReb', 'dReb'],
    'PHYSICALS': ['speed', 'acceleration', 'strength', 'vertical', 'stamina'],
  };

  const attributeLabels: Record<keyof Attributes, string> = {
    close: 'Close Shot', mid: 'Mid-Range', three: '3-Point', freeThrow: 'Free Throw',
    drivingLayup: 'Driving Layup', drivingDunk: 'Driving Dunk', postControl: 'Post Control',
    passAccuracy: 'Pass Accuracy', ballHandle: 'Ball Handle', speedWithBall: 'Speed w/ Ball',
    interiorD: 'Interior Defense', perimeterD: 'Perimeter Defense', steal: 'Steal', block: 'Block',
    oReb: 'Off. Rebound', dReb: 'Def. Rebound',
    speed: 'Speed', acceleration: 'Acceleration', strength: 'Strength', vertical: 'Vertical', stamina: 'Stamina',
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader />
      
      <main className="px-4 pt-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Info & OVR */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Player Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold">{playerInfo.nameFirst} {playerInfo.nameLast}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{playerInfo.position}</Badge>
                    <Badge variant="secondary" className="text-xs">
                      {playerInfo.heightInches ? inchesToFeetInches(playerInfo.heightInches) : 'N/A'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {playerInfo.archetype}
                  </p>
                </div>
                
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-primary mb-2" data-testid="text-ovr">
                    {getOVR()}
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Rating</p>
                  <div className="mt-2">
                    <Progress value={(getOVR() / 99) * 100} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max at creation: 65 OVR
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-sm font-medium">Available Points</p>
                  <p className="text-2xl font-bold text-primary" data-testid="text-available-points">
                    {availablePoints}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Starting: {maxPoints} ({currentSettings.difficulty})
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Badge Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Badge Preview
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Badges available based on current attributes</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableBadges().map((badge: any) => (
                    <div key={badge.id} className="p-2 border rounded-md">
                      <p className="text-xs font-medium truncate">{badge.name}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {badge.availableTier}
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Badges will be unlocked during your career
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Attributes */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(attributeCategories).map(([category, attrs]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {attrs.map((attr) => {
                      const attrKey = attr as keyof Attributes;
                      const value = attributes[attrKey];
                      const cap = attributeCaps[attrKey] || 99;
                      
                      return (
                        <div key={attr} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{attributeLabels[attrKey]}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={(value / 99) * 100} className="flex-1 h-2" />
                              <span className="text-sm font-mono w-8 text-right">{value}</span>
                              <span className="text-xs text-muted-foreground">/{cap}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => adjustAttribute(attrKey, -1)}
                              disabled={!canDecrease(attrKey)}
                              data-testid={`decrease-${attr}`}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => adjustAttribute(attrKey, 1)}
                              disabled={!canIncrease(attrKey)}
                              data-testid={`increase-${attr}`}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={resetAttributes}
                data-testid="button-reset"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button 
                variant="default" 
                className="flex-1"
                onClick={handleSaveBuild}
                disabled={getOVR() > 65}
                data-testid="button-save-build"
              >
                Save Build
              </Button>
            </div>
            
            {getOVR() > 65 && (
              <p className="text-sm text-destructive text-center">
                OVR cannot exceed 65 at creation. Remove some attribute points.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}