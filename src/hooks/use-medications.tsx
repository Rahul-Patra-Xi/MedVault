import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { storageGet, storageSet, generateId, KEYS } from '@/lib/storage';
import type { Medication } from '@/lib/types';

const SEED: Medication[] = [
  { id: 'm1', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', startDate: '2026-03-20', active: true },
  { id: 'm2', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2025-06-01', active: true },
  { id: 'm3', name: 'Vitamin D3', dosage: '2000 IU', frequency: 'Once daily', startDate: '2025-01-15', active: true },
  { id: 'm4', name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', startDate: '2025-10-01', endDate: '2025-10-10', active: false },
];

function load(): Medication[] {
  const stored = storageGet<Medication[] | null>(KEYS.MEDICATIONS, null);
  if (stored === null) { storageSet(KEYS.MEDICATIONS, SEED); return SEED; }
  return stored;
}

interface MedsContextType {
  medications: Medication[];
  addMedication: (m: Omit<Medication, 'id'>) => void;
  deleteMedication: (id: string) => void;
  toggleMedication: (id: string) => void;
}

const MedsContext = createContext<MedsContextType>({
  medications: [],
  addMedication: () => {},
  deleteMedication: () => {},
  toggleMedication: () => {},
});

export function MedicationsProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>(load);

  const save = (list: Medication[]) => { setMedications(list); storageSet(KEYS.MEDICATIONS, list); };

  const addMedication = useCallback((m: Omit<Medication, 'id'>) => {
    setMedications(prev => { const u = [{ ...m, id: generateId() }, ...prev]; storageSet(KEYS.MEDICATIONS, u); return u; });
  }, []);

  const deleteMedication = useCallback((id: string) => {
    setMedications(prev => { const u = prev.filter(m => m.id !== id); storageSet(KEYS.MEDICATIONS, u); return u; });
  }, []);

  const toggleMedication = useCallback((id: string) => {
    setMedications(prev => {
      const u = prev.map(m => m.id === id ? { ...m, active: !m.active, endDate: m.active ? new Date().toISOString().split('T')[0] : undefined } : m);
      storageSet(KEYS.MEDICATIONS, u);
      return u;
    });
  }, []);

  return <MedsContext.Provider value={{ medications, addMedication, deleteMedication, toggleMedication }}>{children}</MedsContext.Provider>;
}

export const useMedications = () => useContext(MedsContext);
