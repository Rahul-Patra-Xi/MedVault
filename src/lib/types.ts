export type RecordCategory = 'prescription' | 'lab_report' | 'imaging' | 'vaccination' | 'surgery' | 'consultation';

export interface MedicalRecord {
  id: string;
  title: string;
  category: RecordCategory;
  date: string;
  doctor: string;
  hospital: string;
  tags: string[];
  fileType: 'pdf' | 'image' | 'dicom';
  summary?: string;
  isShared?: boolean;
  /** base64 encoded file data */
  fileData?: string;
  fileName?: string;
  fileMimeType?: string;
  uploadedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  active: boolean;
}

export interface SharedLink {
  id: string;
  recordIds: string[];
  createdAt: string;
  expiresAt: string;
  accessCount: number;
  permission: 'view' | 'download';
  isActive: boolean;
  recipientName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  bloodType?: string;
  addressLine?: string;
  /** Indian state / UT id (see `INDIAN_STATES_UT`) */
  addressStateId?: string;
  addressPin?: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

export const categoryConfig: Record<RecordCategory, { label: string; color: string; icon: string }> = {
  prescription: { label: 'Prescription', color: 'bg-primary/10 text-primary', icon: '💊' },
  lab_report: { label: 'Lab Report', color: 'bg-health-green/10 text-health-green', icon: '🧪' },
  imaging: { label: 'Imaging', color: 'bg-health-purple/10 text-health-purple', icon: '📷' },
  vaccination: { label: 'Vaccination', color: 'bg-health-orange/10 text-health-orange', icon: '💉' },
  surgery: { label: 'Surgery', color: 'bg-health-red/10 text-health-red', icon: '🏥' },
  consultation: { label: 'Consultation', color: 'bg-accent/10 text-accent', icon: '👨‍⚕️' },
};
