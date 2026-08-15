import { useEffect, useState } from 'react';
import { getEmptyHealthRecord, useHealthRecordStore } from './useHealthRecordStore';

// "오늘의 건강 기록" 모달의 입력 상태. 다른 등록 모달들(useScheduleRegistrationForm 등)과 같은 패턴으로,
// visible이 켜질 때마다 그 어르신의 저장된 값(없으면 빈 값)으로 리셋함
export function useHealthRecordForm(wardId: string, visible: boolean) {
  const [bloodSugar, setBloodSugar] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (!visible) return;
    const saved = useHealthRecordStore.getState().recordByWard[wardId] ?? getEmptyHealthRecord();
    setBloodSugar(saved.bloodSugar);
    setBloodPressure(saved.bloodPressure);
    setWeight(saved.weight);
  }, [wardId, visible]);

  const handleSave = (onSaved: () => void) => {
    useHealthRecordStore.getState().setRecord(wardId, { bloodSugar, bloodPressure, weight });
    onSaved();
  };

  return {
    state: { bloodSugar, bloodPressure, weight },
    actions: { setBloodSugar, setBloodPressure, setWeight, handleSave },
  };
}
