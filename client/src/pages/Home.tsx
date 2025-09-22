import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Palette } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen arena-bg flex flex-col justify-center items-center p-4">
      <div className="text-center mb-12">
        <h1 className="font-pixel text-4xl text-white mb-2">
          Hoop Dreams
        </h1>
        <p className="text-white/80 text-sm">Basketball Life Simulator</p>
      </div>
      
      <div className="w-full max-w-sm space-y-3">
        <Link to="/play">
          <Button
            variant="default"
            size="lg"
            className="w-full justify-start gap-3 h-12"
          >
            <Play className="w-5 h-5" />
            Play
          </Button>
        </Link>
        
        <Link to="/customize-new">
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start gap-3 h-12"
          >
            <Palette className="w-5 h-5" />
            Customize Avatar
          </Button>
        </Link>
      </div>
    </div>
  );
}