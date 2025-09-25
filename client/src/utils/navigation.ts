// Standardized navigation utilities for back navigation
import { useLocation } from "wouter";

export function useBackNavigation(fallback: string = "/home") {
  const [, setLocation] = useLocation();
  
  const navigateBack = () => {
    // Use browser history index to determine if we can go back
    const idx = (window.history.state && (window.history.state as any).idx) ?? 0;
    if (idx > 0) {
      window.history.back();
    } else {
      setLocation(fallback);
    }
  };
  
  return navigateBack;
}

// Standalone function for back navigation
export function navigateBack(setLocation: (path: string) => void, fallback: string = "/home") {
  const idx = (window.history.state && (window.history.state as any).idx) ?? 0;
  if (idx > 0) {
    window.history.back();
  } else {
    setLocation(fallback);
  }
}