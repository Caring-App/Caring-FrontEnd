import { create } from 'zustand';
import { MOCK_WARDS } from '@features/ward-management/model';
import { MedicationEntry, MedicationRegistrationData } from './medicationTypes';

interface MedicationListState {
  medicationsByWard: Record<string, MedicationEntry[]>;
  addMedication: (wardId: string, data: MedicationRegistrationData) => void;
  updateMedication: (wardId: string, id: string, data: MedicationRegistrationData) => void;
  deleteMedication: (wardId: string, id: string) => void;
  toggleEnabled: (wardId: string, id: string) => void;
}

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// TODO: 백엔드 연동 전 mock 데이터(Figma 296:11264 복약 등록 모달 기준 시드)
const MOCK_MEDICATIONS_BY_WARD: Record<string, MedicationEntry[]> = {
  [MOCK_WARDS[0].id]: [
    {
      id: 'morning',
      name: '아침 약',
      mealTypes: ['morning'],
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      time: { hour: '08', minute: '00', second: '00', amPm: 'AM' },
      reminderInterval: '10분 후',
      soundType: 'tts',
      enabled: false,
    },
    {
      id: 'lunch',
      name: '점심 약',
      mealTypes: ['lunch'],
      days: ['mon', 'tue', 'wed', 'thu', 'fri'],
      time: { hour: '02', minute: '00', second: '00', amPm: 'PM' },
      reminderInterval: '10분 후',
      soundType: 'tts',
      enabled: false,
    },
    {
      id: 'dinner',
      name: '저녁 약',
      mealTypes: ['dinner'],
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      time: { hour: '08', minute: '00', second: '00', amPm: 'PM' },
      reminderInterval: '10분 후',
      soundType: 'tts',
      enabled: false,
    },
  ],
};

export const useMedicationListStore = create<MedicationListState>(set => ({
  medicationsByWard: MOCK_MEDICATIONS_BY_WARD,
  addMedication: (wardId, data) =>
    set(state => ({
      medicationsByWard: {
        ...state.medicationsByWard,
        [wardId]: [...(state.medicationsByWard[wardId] ?? []), { ...data, id: createId(), enabled: true }],
      },
    })),
  updateMedication: (wardId, id, data) =>
    set(state => ({
      medicationsByWard: {
        ...state.medicationsByWard,
        [wardId]: (state.medicationsByWard[wardId] ?? []).map(entry =>
          entry.id === id ? { ...entry, ...data } : entry,
        ),
      },
    })),
  deleteMedication: (wardId, id) =>
    set(state => ({
      medicationsByWard: {
        ...state.medicationsByWard,
        [wardId]: (state.medicationsByWard[wardId] ?? []).filter(entry => entry.id !== id),
      },
    })),
  toggleEnabled: (wardId, id) =>
    set(state => ({
      medicationsByWard: {
        ...state.medicationsByWard,
        [wardId]: (state.medicationsByWard[wardId] ?? []).map(entry =>
          entry.id === id ? { ...entry, enabled: !entry.enabled } : entry,
        ),
      },
    })),
}));
