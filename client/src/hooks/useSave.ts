import { useState, useEffect } from 'react';
import { loadSave, type SaveState } from '@/state/sim';
import { saveBus } from '@/state/saveBus';

export function useSave(): SaveState {
  const [save, setSave] = useState<SaveState>(loadSave);

  useEffect(() => {
    const handleSaveChanged = () => {
      setSave(loadSave());
    };

    const handleStorageChanged = (e: StorageEvent) => {
      if (e.key === 'hd.save.v1') {
        setSave(loadSave());
      }
    };

    // Subscribe to saveBus events
    saveBus.addEventListener('save-changed', handleSaveChanged);
    
    // Subscribe to storage events (for cross-tab sync)
    window.addEventListener('storage', handleStorageChanged);

    return () => {
      saveBus.removeEventListener('save-changed', handleSaveChanged);
      window.removeEventListener('storage', handleStorageChanged);
    };
  }, []);

  return save;
}