import { useCallback, useState } from 'react';
import {
  type DashboardDemoData,
  loadDashboardDemoData,
  saveDashboardDemoData,
} from '@/lib/dashboard-demo-data';

export function useDashboardDemo() {
  const [data, setData] = useState<DashboardDemoData>(loadDashboardDemoData);

  const updateData = useCallback((updater: (prev: DashboardDemoData) => DashboardDemoData) => {
    setData(prev => {
      const next = updater(prev);
      saveDashboardDemoData(next);
      return next;
    });
  }, []);

  const toggleMedicationTaken = useCallback((medicationId: string) => {
    updateData(prev => ({
      ...prev,
      medications: prev.medications.map(med =>
        med.id === medicationId
          ? {
              ...med,
              takenToday: !med.takenToday,
              status: !med.takenToday ? 'completed' : 'active',
            }
          : med
      ),
    }));
  }, [updateData]);

  const revokeShare = useCallback((shareId: string) => {
    updateData(prev => ({
      ...prev,
      shares: prev.shares.map(share =>
        share.id === shareId ? { ...share, isActive: false, expiryText: 'Revoked' } : share
      ),
    }));
  }, [updateData]);

  return {
    data,
    toggleMedicationTaken,
    revokeShare,
  };
}
