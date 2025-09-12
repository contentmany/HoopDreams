interface PreGameLayoutProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
}

export default function PreGameLayout({ 
  children, 
  title = "Hoop Dreams",
  showHeader = true 
}: PreGameLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {showHeader && (
        <header 
          className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-card-border px-4 py-3" 
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
        >
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-pixel text-primary">{title}</h1>
              <p className="text-xs text-muted-foreground">Basketball Life Simulator</p>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}