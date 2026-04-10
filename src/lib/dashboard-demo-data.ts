import { KEYS, storageGet, storageSet } from '@/lib/storage';

export interface DashboardUpload {
  id: string;
  name: string;
  date: string;
  category: 'prescription' | 'lab_report' | 'imaging' | 'other';
}

export interface DashboardMedication {
  id: string;
  name: string;
  dosage: string;
  timing: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  status: 'active' | 'completed';
  nextDoseText?: string;
  takenToday: boolean;
}

export interface DashboardShare {
  id: string;
  sharedWith: string;
  hospital: string;
  expiryText: string;
  link: string;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardSecurity {
  score: number;
  encryptionEnabled: boolean;
  backupEnabled: boolean;
  passwordStrength: 'Weak' | 'Medium' | 'Strong';
  suggestions: string[];
}

export interface DashboardDemoData {
  recordBreakdown: {
    prescriptions: number;
    labReports: number;
    imaging: number;
    others: number;
  };
  recentUploads: DashboardUpload[];
  medications: DashboardMedication[];
  shares: DashboardShare[];
  security: DashboardSecurity;
}

const DASHBOARD_KEY = 'medvault_dashboard_demo_data';

export const DASHBOARD_DEMO_DATA: DashboardDemoData = {
  recordBreakdown: {
    prescriptions: 3,
    labReports: 2,
    imaging: 1,
    others: 2,
  },
  recentUploads: [
    {
      id: 'du-1',
      name: 'Blood Test Report',
      date: '12 Feb 2026',
      category: 'lab_report',
    },
    {
      id: 'du-2',
      name: 'MRI Scan',
      date: '02 Jan 2026',
      category: 'imaging',
    },
    {
      id: 'du-3',
      name: 'Prescription - Dr. Sharma',
      date: '20 Mar 2026',
      category: 'prescription',
    },
  ],
  medications: [
    {
      id: 'dm-1',
      name: 'Paracetamol',
      dosage: '500mg',
      timing: 'Morning',
      status: 'active',
      nextDoseText: 'Next dose in 2 hrs',
      takenToday: false,
    },
    {
      id: 'dm-2',
      name: 'Metformin',
      dosage: '500mg',
      timing: 'Evening',
      status: 'active',
      nextDoseText: 'Next dose at 8:00 PM',
      takenToday: false,
    },
    {
      id: 'dm-3',
      name: 'Amoxicillin',
      dosage: '250mg',
      timing: 'Night',
      status: 'completed',
      takenToday: true,
    },
  ],
  shares: [
    {
      id: 'ds-1',
      sharedWith: 'Dr. Mehta',
      hospital: 'City Care Hospital',
      expiryText: 'Expires in 12 hrs',
      link: 'https://medivault.app/share/demo-dr-mehta',
      isActive: true,
      createdAt: '10 Apr 2026',
    },
    {
      id: 'ds-2',
      sharedWith: 'Lab Team',
      hospital: 'Metro Diagnostics',
      expiryText: 'Expires in 2 days',
      link: 'https://medivault.app/share/demo-lab-team',
      isActive: true,
      createdAt: '09 Apr 2026',
    },
    {
      id: 'ds-3',
      sharedWith: 'Dr. Singh',
      hospital: 'Sunrise Clinic',
      expiryText: 'Expired',
      link: 'https://medivault.app/share/demo-dr-singh',
      isActive: false,
      createdAt: '04 Apr 2026',
    },
  ],
  security: {
    score: 95,
    encryptionEnabled: true,
    backupEnabled: true,
    passwordStrength: 'Strong',
    suggestions: ['Enable 2FA for better security'],
  },
};

export function loadDashboardDemoData(): DashboardDemoData {
  const fromStorage = storageGet<DashboardDemoData | null>(DASHBOARD_KEY, null);
  if (fromStorage === null) {
    storageSet(DASHBOARD_KEY, DASHBOARD_DEMO_DATA);
    return DASHBOARD_DEMO_DATA;
  }
  return fromStorage;
}

export function saveDashboardDemoData(data: DashboardDemoData): void {
  storageSet(DASHBOARD_KEY, data);
}

export function resetDashboardDemoData(): void {
  storageSet(DASHBOARD_KEY, DASHBOARD_DEMO_DATA);
}

export const DASHBOARD_STORAGE_KEYS = {
  DASHBOARD_KEY,
  LEGACY_RECORDS_KEY: KEYS.RECORDS,
} as const;
