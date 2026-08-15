import { create } from 'zustand';

export interface HealthRecordEntry {
  bloodSugar: string;
  bloodPressure: string;
  weight: string;
}

const EMPTY_RECORD: HealthRecordEntry = { bloodSugar: '', bloodPressure: '', weight: '' };

interface HealthRecordState {
  // 돌봄대상자가 "오늘의 건강 기록" 모달에서 입력한 값. 어르신별로 따로 보관함
  // TODO: 실서비스에서는 저장 시 서버로 전송해 보호자의 저녁 레포트에 반영되도록 연동 필요
  recordByWard: Record<string, HealthRecordEntry>;
  setRecord: (wardId: string, entry: HealthRecordEntry) => void;
}

export const useHealthRecordStore = create<HealthRecordState>(set => ({
  recordByWard: {},
  setRecord: (wardId, entry) =>
    set(state => ({ recordByWard: { ...state.recordByWard, [wardId]: entry } })),
}));

export function getEmptyHealthRecord(): HealthRecordEntry {
  return { ...EMPTY_RECORD };
}
