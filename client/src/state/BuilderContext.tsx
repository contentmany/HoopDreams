import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface BuilderAttributes {
  finishing: number;
  shooting: number;
  rebounding: number;
  defense: number;
  physicals: number;
}

export interface BuilderState {
  firstName: string;
  lastName: string;
  position: string;
  archetype: string;
  heightInCm: number;
  attributes: BuilderAttributes;
  photoDataUrl?: string;
}

const DEFAULT_ATTRIBUTES: BuilderAttributes = {
  finishing: 60,
  shooting: 55,
  rebounding: 45,
  defense: 40,
  physicals: 65,
};

const DEFAULT_BUILDER_STATE: BuilderState = {
  firstName: '',
  lastName: '',
  position: '',
  archetype: '',
  heightInCm: 183,
  attributes: DEFAULT_ATTRIBUTES,
  photoDataUrl: undefined,
};

interface BuilderContextType {
  state: BuilderState;
  updateState: (updates: Partial<BuilderState>) => void;
  updateAttributes: (updates: Partial<BuilderAttributes>) => void;
  reset: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

const STORAGE_KEY = 'hd.builder.state.v1';

function loadBuilderState(): BuilderState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_BUILDER_STATE, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load builder state:', error);
  }
  return DEFAULT_BUILDER_STATE;
}

function saveBuilderState(state: BuilderState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save builder state:', error);
  }
}

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BuilderState>(loadBuilderState);

  useEffect(() => {
    saveBuilderState(state);
  }, [state]);

  const updateState = (updates: Partial<BuilderState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  };

  const updateAttributes = (updates: Partial<BuilderAttributes>) => {
    setState(prevState => ({
      ...prevState,
      attributes: { ...prevState.attributes, ...updates }
    }));
  };

  const reset = () => {
    setState(DEFAULT_BUILDER_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const contextValue: BuilderContextType = {
    state,
    updateState,
    updateAttributes,
    reset,
  };

  return (
    <BuilderContext.Provider value={contextValue}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}