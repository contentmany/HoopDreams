import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackLink from "@/components/BackLink";
import AvatarImage from "@/features/avatar/AvatarImage";
import StatsTable from "@/components/profile/StatsTable";
import AwardsList from "@/components/profile/AwardsList";
import HistoryList from "@/components/profile/HistoryList";
import { player as playerStorage } from "@/utils/localStorage";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("stats");
  const currentPlayer = playerStorage.get();

  if (!currentPlayer) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <BackLink className="text-primary hover:text-primary/80 mb-4 inline-block">
            ← Back
          </BackLink>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No player data found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <BackLink className="text-primary hover:text-primary/80 transition-colors">
            ← Back
          </BackLink>
          <h1 className="text-3xl font-bold">Player Profile</h1>
        </div>

        {/* Header Card - Avatar + Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Player Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <AvatarImage size={80} />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold" data-testid="text-player-name">
                  {currentPlayer.nameFirst} {currentPlayer.nameLast}
                </h2>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span data-testid="text-position">
                    Position: {currentPlayer.position}
                  </span>
                  <span data-testid="text-archetype">
                    Archetype: {currentPlayer.archetype}
                  </span>
                  <span data-testid="text-age">
                    Age: {currentPlayer.age || 16}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>Level: High School</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Stats/Awards/History */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats" data-testid="tab-stats">
              Stats
            </TabsTrigger>
            <TabsTrigger value="awards" data-testid="tab-awards">
              Awards
            </TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="mt-6">
            <StatsTable />
          </TabsContent>
          
          <TabsContent value="awards" className="mt-6">
            <AwardsList />
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <HistoryList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}