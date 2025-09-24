import { useLocation } from "wouter";

export default function BackLink({
  fallback = "/",
  children = "← Back",
  className = "",
}: { fallback?: string; children?: React.ReactNode; className?: string }) {
  const [, setLocation] = useLocation();
  
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if there's history to go back to
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation(fallback);
    }
  };
  
  return (
    <a href={fallback} onClick={onClick} className={className}>
      {children}
    </a>
  );
}