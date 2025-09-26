import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AwardsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Awards & Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          <p>No awards yet</p>
          <p className="text-sm">Play through seasons to earn achievements</p>
        </div>
      </CardContent>
    </Card>
  );
}