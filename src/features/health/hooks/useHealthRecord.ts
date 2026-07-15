import { useState } from 'react';
import { HealthData } from '../types/health';

export const useHealthRecord = () => {
  const [data, setData] = useState<HealthData>({ bloodSugar: '', bloodPressure: '', weight: '' });

  const updateField = (key: keyof HealthData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setData({ bloodSugar: '', bloodPressure: '', weight: '' });

  return { data, updateField, reset };
};