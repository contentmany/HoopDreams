import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Career History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          <p>Nothing here yet</p>
          <p className="text-sm">Your career milestones will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
}