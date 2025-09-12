import { useEffect } from "react";
import { useLocation } from "wouter";
import { activeSlot } from "@/utils/localStorage";
import { useToast } from "@/hooks/use-toast";

interface RouteGuardProps {
  children: React.ReactNode;
  requireActiveSave?: boolean;
}

export default function RouteGuard({ children, requireActiveSave = false }: RouteGuardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (requireActiveSave) {
      const currentSlot = activeSlot.get();
      if (currentSlot === null) {
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
  }, [requireActiveSave, setLocation, toast]);

  if (requireActiveSave) {
    const currentSlot = activeSlot.get();
    if (currentSlot === null) {
      return null; // Will redirect via useEffect
    }
  }

  return <>{children}</>;
}