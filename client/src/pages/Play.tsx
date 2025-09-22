import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Play() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Play Game</h1>
          <p className="text-muted-foreground mb-8">
            This is where the game would start. For now, this is a placeholder.
          </p>
          <p className="text-sm text-muted-foreground">
            In the full app, this would lead to the main game interface.
          </p>
        </div>
      </div>
    </div>
  );
}