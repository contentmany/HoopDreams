import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGameStore } from "@/state/gameStore";
import { useToast } from "@/hooks/use-toast";

interface RouteGuardProps {
  children: React.ReactNode;
  requireActiveSave?: boolean;
}

export default function RouteGuard({ children, requireActiveSave = false }: RouteGuardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const hasValidPlayer = useGameStore(state => state.hasValidPlayer);

  useEffect(() => {
    if (requireActiveSave) {
      if (!hasValidPlayer()) {
        // Show toast first, then redirect after a brief delay
        toast({
          title: "Save Required",
          description: "Create or load a player to continue.",
          variant: "destructive",
        });
        setTimeout(() => {
          setLocation('/load');
        }, 100);
      }
    }
  }, [requireActiveSave, setLocation, toast, hasValidPlayer]);

  if (requireActiveSave) {
    if (!hasValidPlayer()) {
      return null; // Will redirect via useEffect
    }
  }

  return <>{children}</>;
}