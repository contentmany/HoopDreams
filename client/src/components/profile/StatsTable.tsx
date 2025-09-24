import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Season Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          <p>No stats yet</p>
          <p className="text-sm">Start playing games to see your statistics here</p>
        </div>
      </CardContent>
    </Card>
  );
}