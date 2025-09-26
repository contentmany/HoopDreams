import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BuilderDraft {
  firstName?: string;
  lastName?: string;
  position?: string;
  archetype?: string;
  heightInCm?: number;
  attributes?: Record<string, number>;
}

interface BuilderDraftContextType {
  draft: BuilderDraft;
  updateDraft: (updates: Partial<BuilderDraft>) => void;
  clearDraft: () => void;
  hasDraft: boolean;
}

const BuilderDraftContext = createContext<BuilderDraftContextType | undefined>(undefined);

const DRAFT_KEY = 'hd.builderDraft';

export function BuilderDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BuilderDraft>({});

  // Load draft from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(DRAFT_KEY);
    if (stored) {
      try {
        setDraft(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to parse builder draft from sessionStorage');
      }
    }
  }, []);

  // Save to sessionStorage whenever draft changes
  useEffect(() => {
    if (Object.keys(draft).length > 0) {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }
  }, [draft]);

  const updateDraft = (updates: Partial<BuilderDraft>) => {
    setDraft(prev => ({ ...prev, ...updates }));
  };

  const clearDraft = () => {
    setDraft({});
    sessionStorage.removeItem(DRAFT_KEY);
  };

  const hasDraft = Object.keys(draft).length > 0;

  return (
    <BuilderDraftContext.Provider value={{ draft, updateDraft, clearDraft, hasDraft }}>
      {children}
    </BuilderDraftContext.Provider>
  );
}

export function useBuilderDraft() {
  const context = useContext(BuilderDraftContext);
  if (context === undefined) {
    throw new Error('useBuilderDraft must be used within a BuilderDraftProvider');
  }
  return context;
}