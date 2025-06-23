import { useState, useEffect } from 'react';
import type { Maintenance } from '@/types/Maintenance';
import * as api from '@/api/maintenanceApi';

export const useMaintenances = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMaintenances();
      setMaintenances(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { maintenances, loading, error, refetch };
};