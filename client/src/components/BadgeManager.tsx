import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, Plus, Minus, Info, Star, Trophy } from "lucide-react";
import { 
  getAvailableBadges, 
  canEquipBadge, 
  equipBadge, 
  unequipBadge, 
  getBadgePointCost, 
  getBadgesByCategory,
  type AvailableBadge 
} from "@/utils/badgeManager";
import { badges } from "@/utils/gameConfig";
import type { Player } from "@/utils/localStorage";

interface BadgeManagerProps {
  player: Player;
  onUpdatePlayer: (player: Player) => void;
  compact?: boolean;
}

export default function BadgeManager({ player, onUpdatePlayer, compact = false }: BadgeManagerProps) {
  const [availableBadges, setAvailableBadges] = useState<AvailableBadge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBadge, setSelectedBadge] = useState<AvailableBadge | null>(null);

  useEffect(() => {
    const available = getAvailableBadges(player);
    setAvailableBadges(available);
    
    // Set first available category when badges update
    const categorized = getBadgesByCategory(available);
    const categories = Object.keys(categorized);
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [player, selectedCategory]);

  const categorizedBadges = getBadgesByCategory(availableBadges);
  const categories = Object.keys(categorizedBadges);

  const handleEquipBadge = (badgeId: string, tier: 'Bronze' | 'Silver' | 'Gold' | 'HOF') => {
    try {
      const updatedPlayer = equipBadge(player, badgeId, tier);
      onUpdatePlayer(updatedPlayer);
    } catch (error) {
      console.error('Failed to equip badge:', error);
      alert('Cannot equip badge: ' + (error as Error).message);
    }
  };

  const handleUnequipBadge = (badgeId: string) => {
    try {
      const updatedPlayer = unequipBadge(player, badgeId);
      onUpdatePlayer(updatedPlayer);
    } catch (error) {
      console.error('Failed to unequip badge:', error);
      alert('Cannot unequip badge: ' + (error as Error).message);
    }
  };

  const getTierIcon = (tier: 'Bronze' | 'Silver' | 'Gold' | 'HOF') => {
    switch (tier) {
      case 'Bronze': return <Award className="w-4 h-4 text-amber-600" />;
      case 'Silver': return <Award className="w-4 h-4 text-slate-400" />;
      case 'Gold': return <Award className="w-4 h-4 text-yellow-500" />;
      case 'HOF': return <Trophy className="w-4 h-4 text-purple-500" />;
    }
  };

  const getTierColor = (tier: 'Bronze' | 'Silver' | 'Gold' | 'HOF') => {
    switch (tier) {
      case 'Bronze': return 'border-amber-600 bg-amber-50 dark:bg-amber-950';
      case 'Silver': return 'border-slate-400 bg-slate-50 dark:bg-slate-950';
      case 'Gold': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'HOF': return 'border-purple-500 bg-purple-50 dark:bg-purple-950';
    }
  };

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Badges ({player.badges.length})
            <Badge variant="outline" className="ml-auto">
              {player.badgePoints} points
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {player.badges.slice(0, 6).map((equippedBadge) => {
              const badgeDefinition = badges.find(b => b.id === equippedBadge.id);
              if (!badgeDefinition) return null;
              
              return (
                <div key={equippedBadge.id} className="flex items-center gap-2 p-2 border rounded">
                  {getTierIcon(equippedBadge.tier)}
                  <span className="text-xs font-medium truncate">
                    {badgeDefinition.name}
                  </span>
                </div>
              );
            })}
          </div>
          {player.badges.length > 6 && (
            <p className="text-xs text-muted-foreground mt-2">
              +{player.badges.length - 6} more badges
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Badge Manager</h2>
          <p className="text-muted-foreground">
            Equip badges to enhance your player's abilities
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1" data-testid="text-badge-points">
          {player.badgePoints} Badge Points
        </Badge>
      </div>

      {/* Equipped Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Equipped Badges ({player.badges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {player.badges.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No badges equipped yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {player.badges.map((equippedBadge) => {
                const badgeDefinition = badges.find(b => b.id === equippedBadge.id);
                if (!badgeDefinition) return null;
                
                return (
                  <div 
                    key={equippedBadge.id} 
                    className={`p-3 border-2 rounded-lg ${getTierColor(equippedBadge.tier)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTierIcon(equippedBadge.tier)}
                        <span className="font-medium">{badgeDefinition.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUnequipBadge(equippedBadge.id)}
                        data-testid={`unequip-badge-${equippedBadge.id}`}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {badgeDefinition.description}
                    </p>
                    <p className="text-xs font-mono mt-1">
                      Cost: {getBadgePointCost(equippedBadge.tier)} points
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Available Badges ({availableBadges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {availableBadges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No badges available yet. Improve your attributes and milestones to unlock badges!
              </p>
            </div>
          ) : (
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-4">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorizedBadges[category]?.map((badge) => (
                    <div key={badge.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTierIcon(badge.availableTier)}
                          <span className="font-medium">{badge.name}</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Info className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {getTierIcon(badge.availableTier)}
                                {badge.name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>{badge.description}</p>
                              <div>
                                <p className="text-sm font-medium mb-2">Requirements:</p>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm">Attribute Value:</span>
                                    <span className="text-sm font-mono">{badge.attributeValue}</span>
                                  </div>
                                  {badge.milestoneKey && badge.milestoneValue !== undefined && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">Milestone Progress:</span>
                                      <span className="text-sm font-mono">{badge.milestoneValue}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {badge.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Cost: {getBadgePointCost(badge.availableTier)} points</span>
                          <span className="font-mono">
                            {badge.attributeKey !== 'calculated' ? 
                              `${badge.attributeKey}: ${badge.attributeValue}` : 
                              `Calculated: ${badge.attributeValue}`
                            }
                          </span>
                        </div>
                        
                        {badge.milestoneKey && badge.milestoneValue !== undefined && (
                          <div className="text-xs text-muted-foreground">
                            {badge.milestoneKey}: {badge.milestoneValue}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        {badge.isEquipped ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleUnequipBadge(badge.id)}
                              data-testid={`unequip-${badge.id}`}
                            >
                              Unequip
                            </Button>
                            {badge.canUpgrade && (
                              <Button
                                size="sm"
                                variant="default"
                                className="flex-1"
                                onClick={() => handleEquipBadge(badge.id, badge.availableTier)}
                                disabled={!canEquipBadge(player, badge.id, badge.availableTier)}
                                data-testid={`upgrade-${badge.id}`}
                              >
                                Upgrade
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            className="w-full"
                            onClick={() => handleEquipBadge(badge.id, badge.availableTier)}
                            disabled={!canEquipBadge(player, badge.id, badge.availableTier)}
                            data-testid={`equip-${badge.id}`}
                          >
                            Equip ({getBadgePointCost(badge.availableTier)} pts)
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}