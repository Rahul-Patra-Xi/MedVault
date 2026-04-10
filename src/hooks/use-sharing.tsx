import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { storageGet, storageSet, generateId, KEYS } from '@/lib/storage';
import type { SharedLink } from '@/lib/types';

const SEED: SharedLink[] = [
  { id: 'sh1', recordIds: ['s1', 's7'], createdAt: '2026-04-06', expiresAt: '2026-04-13', accessCount: 3, permission: 'view', isActive: true, recipientName: 'Dr. Sarah Chen' },
  { id: 'sh2', recordIds: ['s2', 's6'], createdAt: '2026-03-30', expiresAt: '2026-04-06', accessCount: 1, permission: 'download', isActive: false, recipientName: 'RadiologyOne Clinic' },
];

function load(): SharedLink[] {
  const stored = storageGet<SharedLink[] | null>(KEYS.SHARED_LINKS, null);
  if (stored === null) { storageSet(KEYS.SHARED_LINKS, SEED); return SEED; }
  // Auto-expire
  const now = Date.now();
  return stored.map(l => ({ ...l, isActive: l.isActive && new Date(l.expiresAt).getTime() > now }));
}

interface SharingContextType {
  sharedLinks: SharedLink[];
  createShareLink: (recordIds: string[], recipientName: string, permission: 'view' | 'download', expiryDays: number) => SharedLink;
  revokeLink: (id: string) => void;
  incrementAccess: (id: string) => void;
}

const SharingContext = createContext<SharingContextType>({
  sharedLinks: [],
  createShareLink: () => ({} as SharedLink),
  revokeLink: () => {},
  incrementAccess: () => {},
});

export function SharingProvider({ children }: { children: ReactNode }) {
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>(load);

  const save = (list: SharedLink[]) => { setSharedLinks(list); storageSet(KEYS.SHARED_LINKS, list); };

  const createShareLink = useCallback((recordIds: string[], recipientName: string, permission: 'view' | 'download', expiryDays: number) => {
    const now = new Date();
    const expires = new Date(now.getTime() + expiryDays * 86400000);
    const link: SharedLink = {
      id: generateId(),
      recordIds,
      createdAt: now.toISOString().split('T')[0],
      expiresAt: expires.toISOString().split('T')[0],
      accessCount: 0,
      permission,
      isActive: true,
      recipientName,
    };
    setSharedLinks(prev => { const u = [link, ...prev]; storageSet(KEYS.SHARED_LINKS, u); return u; });
    return link;
  }, []);

  const revokeLink = useCallback((id: string) => {
    setSharedLinks(prev => {
      const u = prev.map(l => l.id === id ? { ...l, isActive: false } : l);
      storageSet(KEYS.SHARED_LINKS, u);
      return u;
    });
  }, []);

  const incrementAccess = useCallback((id: string) => {
    setSharedLinks(prev => {
      const u = prev.map(l => l.id === id ? { ...l, accessCount: l.accessCount + 1 } : l);
      storageSet(KEYS.SHARED_LINKS, u);
      return u;
    });
  }, []);

  return <SharingContext.Provider value={{ sharedLinks, createShareLink, revokeLink, incrementAccess }}>{children}</SharingContext.Provider>;
}

export const useSharing = () => useContext(SharingContext);
