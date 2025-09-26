import { useLocation } from "wouter";

export default function BackLink({
  fallback = "/home",
  children = "← Back",
  className = "",
}: { fallback?: string; children?: React.ReactNode; className?: string }) {
  const [, setLocation] = useLocation();
  
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use browser history index to determine if we can go back
    const idx = (window.history.state && (window.history.state as any).idx) ?? 0;
    if (idx > 0) {
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