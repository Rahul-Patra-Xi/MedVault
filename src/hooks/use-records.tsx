import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { storageGet, storageSet, generateId, KEYS } from '@/lib/storage';
import type { MedicalRecord, RecordCategory } from '@/lib/types';

const SEED_RECORDS: MedicalRecord[] = [
  { id: 's1', title: 'Complete Blood Count', category: 'lab_report', date: '2026-04-05', doctor: 'Dr. Sarah Chen', hospital: 'City General Hospital', tags: ['blood', 'routine'], fileType: 'pdf', summary: 'All values within normal range. Hemoglobin: 14.2 g/dL.', uploadedAt: '2026-04-05T10:00:00Z' },
  { id: 's2', title: 'Chest X-Ray', category: 'imaging', date: '2026-03-28', doctor: 'Dr. James Miller', hospital: 'RadiologyOne Clinic', tags: ['chest', 'x-ray'], fileType: 'image', summary: 'No abnormalities detected. Lungs clear.', uploadedAt: '2026-03-28T10:00:00Z' },
  { id: 's3', title: 'Metformin 500mg', category: 'prescription', date: '2026-03-20', doctor: 'Dr. Priya Patel', hospital: 'HealthFirst Medical', tags: ['diabetes', 'medication'], fileType: 'pdf', summary: 'Metformin 500mg twice daily with meals.', uploadedAt: '2026-03-20T10:00:00Z' },
  { id: 's4', title: 'COVID-19 Booster', category: 'vaccination', date: '2026-02-15', doctor: 'Dr. Alex Kim', hospital: 'Community Health Center', tags: ['covid', 'vaccine'], fileType: 'pdf', summary: 'Moderna bivalent booster administered.', uploadedAt: '2026-02-15T10:00:00Z' },
  { id: 's5', title: 'Annual Physical Exam', category: 'consultation', date: '2026-01-10', doctor: 'Dr. Sarah Chen', hospital: 'City General Hospital', tags: ['annual', 'checkup'], fileType: 'pdf', summary: 'Overall health good. BMI: 23.4. Blood pressure: 118/76.', uploadedAt: '2026-01-10T10:00:00Z' },
  { id: 's6', title: 'MRI Brain Scan', category: 'imaging', date: '2025-12-05', doctor: 'Dr. Robert Singh', hospital: 'NeuroHealth Institute', tags: ['brain', 'mri'], fileType: 'dicom', summary: 'No lesions or abnormalities found.', uploadedAt: '2025-12-05T10:00:00Z' },
  { id: 's7', title: 'Lipid Panel', category: 'lab_report', date: '2025-11-18', doctor: 'Dr. Sarah Chen', hospital: 'City General Hospital', tags: ['cholesterol', 'lipids'], fileType: 'pdf', summary: 'LDL slightly elevated at 142 mg/dL. HDL: 55 mg/dL.', uploadedAt: '2025-11-18T10:00:00Z' },
  { id: 's8', title: 'Appendectomy Report', category: 'surgery', date: '2025-08-22', doctor: 'Dr. Maria Lopez', hospital: "St. Mary's Hospital", tags: ['surgery', 'appendix'], fileType: 'pdf', summary: 'Laparoscopic appendectomy. No complications.', uploadedAt: '2025-08-22T10:00:00Z' },
];

function loadRecords(): MedicalRecord[] {
  const stored = storageGet<MedicalRecord[] | null>(KEYS.RECORDS, null);
  if (stored === null) {
    storageSet(KEYS.RECORDS, SEED_RECORDS);
    return SEED_RECORDS;
  }
  return stored;
}

interface RecordsContextType {
  records: MedicalRecord[];
  addRecord: (record: Omit<MedicalRecord, 'id' | 'uploadedAt'>) => MedicalRecord;
  deleteRecord: (id: string) => void;
  updateRecord: (id: string, data: Partial<MedicalRecord>) => void;
  getRecord: (id: string) => MedicalRecord | undefined;
}

const RecordsContext = createContext<RecordsContextType>({
  records: [],
  addRecord: () => ({} as MedicalRecord),
  deleteRecord: () => {},
  updateRecord: () => {},
  getRecord: () => undefined,
});

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MedicalRecord[]>(loadRecords);

  const persist = (updated: MedicalRecord[]) => {
    setRecords(updated);
    storageSet(KEYS.RECORDS, updated);
  };

  const addRecord = useCallback((data: Omit<MedicalRecord, 'id' | 'uploadedAt'>) => {
    const record: MedicalRecord = { ...data, id: generateId(), uploadedAt: new Date().toISOString() };
    setRecords(prev => {
      const updated = [record, ...prev];
      storageSet(KEYS.RECORDS, updated);
      return updated;
    });
    return record;
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => {
      const updated = prev.filter(r => r.id !== id);
      storageSet(KEYS.RECORDS, updated);
      return updated;
    });
  }, []);

  const updateRecord = useCallback((id: string, data: Partial<MedicalRecord>) => {
    setRecords(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...data } : r);
      storageSet(KEYS.RECORDS, updated);
      return updated;
    });
  }, []);

  const getRecord = useCallback((id: string) => records.find(r => r.id === id), [records]);

  return (
    <RecordsContext.Provider value={{ records, addRecord, deleteRecord, updateRecord, getRecord }}>
      {children}
    </RecordsContext.Provider>
  );
}

export const useRecords = () => useContext(RecordsContext);
