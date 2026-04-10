import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { storageGet, storageSet, generateId, KEYS } from '@/lib/storage';
import type { AuditEntry } from '@/lib/types';

const AuditContext = createContext<{
  entries: AuditEntry[];
  log: (action: string, type: AuditEntry['type']) => void;
}>({ entries: [], log: () => {} });

export function AuditProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<AuditEntry[]>(() => storageGet(KEYS.AUDIT_LOG, []));

  const log = useCallback((action: string, type: AuditEntry['type']) => {
    const entry: AuditEntry = { id: generateId(), action, time: new Date().toISOString(), type };
    setEntries(prev => {
      const u = [entry, ...prev].slice(0, 50);
      storageSet(KEYS.AUDIT_LOG, u);
      return u;
    });
  }, []);

  return <AuditContext.Provider value={{ entries, log }}>{children}</AuditContext.Provider>;
}

export const useAudit = () => useContext(AuditContext);
