import { create } from 'zustand';
import { logApiError } from '@shared/api';
import {
  createPillScheduleApi,
  deletePillScheduleApi,
  getPillSchedulesApi,
  togglePillScheduleApi,
  updatePillScheduleApi,
} from '../api/pillScheduleApi';
import {
  daysToTakeDays,
  mealTypeToPillName,
  pillScheduleToEntry,
  reminderIntervalToMinutes,
  soundTypeToAlarmType,
  timeStateToTakeTime,
} from '../utils';
import { MedicationEntry, MedicationRegistrationData, PillSchedule, PillScheduleRequest } from './medicationTypes';

interface MedicationListState {
  medicationsByWard: Record<number, MedicationEntry[]>;
  isLoading: boolean;
  fetchMedications: (wardId: number) => Promise<void>;
  addMedication: (wardId: number, data: MedicationRegistrationData) => Promise<void>;
  updateMedication: (wardId: number, entry: MedicationEntry, data: MedicationRegistrationData) => Promise<void>;
  deleteMedication: (wardId: number, id: number) => Promise<void>;
  toggleEnabled: (wardId: number, id: number) => Promise<void>;
}

function buildRequestBase(wardId: number, data: MedicationRegistrationData): Omit<PillScheduleRequest, 'pillName'> {
  return {
    wardId,
    takeDays: daysToTakeDays(data.days),
    takeTime: timeStateToTakeTime(data.time),
    retryAlarm: reminderIntervalToMinutes(data.reminderInterval),
    alarmType: soundTypeToAlarmType(data.soundType),
    // TODO: useVoiceRecording이 아직 로컬 스텁이라(실제 파일 업로드 없음) 항상 빈 값으로 보냄 — 녹음 업로드 붙으면 채우기
    voiceFileUrl: '',
    active: true,
    isActive: true,
  };
}

export const useMedicationListStore = create<MedicationListState>((set, get) => ({
  medicationsByWard: {},
  isLoading: false,

  fetchMedications: async wardId => {
    set({ isLoading: true });
    try {
      const schedules = await getPillSchedulesApi(wardId);
      set(state => ({
        medicationsByWard: { ...state.medicationsByWard, [wardId]: schedules.map(pillScheduleToEntry) },
      }));
    } catch (error) {
      logApiError('복약 스케줄 조회 실패', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // mealTypes를 여러 개 선택했으면 시간대별로 스케줄을 각각 생성함 (백엔드는 스케줄 1건당 pillName 1개만 허용)
  addMedication: async (wardId, data) => {
    const base = buildRequestBase(wardId, data);
    const created = await Promise.all(
      data.mealTypes.map(mealType => createPillScheduleApi({ ...base, pillName: mealTypeToPillName(mealType) })),
    );
    set(state => ({
      medicationsByWard: {
        ...state.medicationsByWard,
        [wardId]: [...(state.medicationsByWard[wardId] ?? []), ...created.map(pillScheduleToEntry)],
      },
    }));
  },

  // 기존 항목(시간대 1개)을 수정하면서 다른 시간대를 추가로 체크한 경우: 원래 시간대는 PUT으로 업데이트하고
  // 나머지 새로 체크한 시간대는 POST로 별도 스케줄을 새로 만듦. 원래 시간대 체크를 해제했다면 그 스케줄은 삭제.
  updateMedication: async (wardId, entry, data) => {
    const base = buildRequestBase(wardId, data);
    const remaining = [...data.mealTypes];
    const results: PillSchedule[] = [];

    const originalIndex = remaining.indexOf(entry.mealType);
    if (originalIndex !== -1) {
      const updated = await updatePillScheduleApi(entry.id, { ...base, pillName: mealTypeToPillName(entry.mealType) });
      results.push(updated);
      remaining.splice(originalIndex, 1);
    } else {
      await deletePillScheduleApi(entry.id);
    }

    const createdRest = await Promise.all(
      remaining.map(mealType => createPillScheduleApi({ ...base, pillName: mealTypeToPillName(mealType) })),
    );
    results.push(...createdRest);

    set(state => {
      const others = (state.medicationsByWard[wardId] ?? []).filter(item => item.id !== entry.id);
      return {
        medicationsByWard: {
          ...state.medicationsByWard,
          [wardId]: [...others, ...results.map(pillScheduleToEntry)],
        },
      };
    });
  },

  deleteMedication: async (wardId, id) => {
    await deletePillScheduleApi(id);
    set(state => ({
      medicationsByWard: {
        ...state.medicationsByWard,
        [wardId]: (state.medicationsByWard[wardId] ?? []).filter(item => item.id !== id),
      },
    }));
  },

  toggleEnabled: async (wardId, id) => {
    const current = get().medicationsByWard[wardId]?.find(item => item.id === id);
    if (!current) return;
    const updated = await togglePillScheduleApi(id, !current.enabled);
    set(state => ({
      medicationsByWard: {
        ...state.medicationsByWard,
        [wardId]: (state.medicationsByWard[wardId] ?? []).map(item =>
          item.id === id ? pillScheduleToEntry(updated) : item,
        ),
      },
    }));
  },
}));
