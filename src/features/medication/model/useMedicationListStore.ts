import { create } from 'zustand';
import { resetOnLogout } from '@shared/store/resetOnLogout';
import { logApiError } from '@shared/api';
import { notifyLoadFailed } from '@shared/model';
import { soundTypeToAlarmType } from '@shared/utils/alarmType';
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
  timeStateToTakeTime,
} from '../utils';
import { MedicationEntry, MedicationRegistrationData, PillScheduleRequest } from './medicationTypes';

interface MedicationListState {
  medicationsByWard: Record<number, MedicationEntry[]>;
  isLoading: boolean;
  // 켜짐/꺼짐 토글이 진행 중인 스케줄 id 집합 — 연타로 같은 스케줄에 요청이 중복으로 나가는 것을 막는 용도.
  togglingIds: Set<number>;
  fetchMedications: (wardId: number) => Promise<void>;
  addMedication: (wardId: number, data: MedicationRegistrationData) => Promise<void>;
  updateMedication: (wardId: number, entry: MedicationEntry, data: MedicationRegistrationData) => Promise<void>;
  deleteMedication: (wardId: number, id: number) => Promise<void>;
  toggleEnabled: (wardId: number, id: number) => Promise<void>;
}

// active/isActive는 여기서 고정하지 않음 — 스케줄마다 켜짐/꺼짐 상태가 다를 수 있어 호출부에서 채움.
function buildRequestBase(
  wardId: number,
  data: MedicationRegistrationData,
): Omit<PillScheduleRequest, 'pillName' | 'active' | 'isActive'> {
  return {
    wardId,
    takeDays: daysToTakeDays(data.days),
    takeTime: timeStateToTakeTime(data.time),
    retryAlarm: reminderIntervalToMinutes(data.reminderInterval),
    alarmType: soundTypeToAlarmType(data.soundType),
    voiceFileUrl: data.voiceFileUrl,
  };
}

// 서버 응답으로 받은 스케줄 1건을 로컬 목록에 추가하거나 같은 id 항목을 교체함
function upsertMedicationEntry(wardId: number, entry: MedicationEntry) {
  useMedicationListStore.setState(state => {
    const others = (state.medicationsByWard[wardId] ?? []).filter(item => item.id !== entry.id);
    return { medicationsByWard: { ...state.medicationsByWard, [wardId]: [...others, entry] } };
  });
}

function removeMedicationEntry(wardId: number, id: number) {
  useMedicationListStore.setState(state => ({
    medicationsByWard: {
      ...state.medicationsByWard,
      [wardId]: (state.medicationsByWard[wardId] ?? []).filter(item => item.id !== id),
    },
  }));
}

export const useMedicationListStore = create<MedicationListState>((set, get) => ({
  medicationsByWard: {},
  isLoading: false,
  togglingIds: new Set(),

  fetchMedications: async wardId => {
    set({ isLoading: true });
    try {
      const schedules = await getPillSchedulesApi(wardId);
      set(state => ({
        medicationsByWard: { ...state.medicationsByWard, [wardId]: schedules.map(pillScheduleToEntry) },
      }));
    } catch (error) {
      logApiError('복약 스케줄 조회 실패', error);
      notifyLoadFailed();
    } finally {
      set({ isLoading: false });
    }
  },

  // 새로 등록하는 스케줄은 항상 켜진 상태로 시작(끄는 건 등록 후 토글로).
  addMedication: async (wardId, data) => {
    const created = await createPillScheduleApi({
      ...buildRequestBase(wardId, data),
      pillName: mealTypeToPillName(data.mealType),
      active: true,
      isActive: true,
    });
    upsertMedicationEntry(wardId, pillScheduleToEntry(created));
  },

  // 시간대를 바꿔도 같은 스케줄을 수정함(PUT이 pillName도 바꿈). 켜짐/꺼짐 상태는 그대로 유지 — 수정 저장이 토글 상태를 되돌리면 안 됨.
  updateMedication: async (wardId, entry, data) => {
    const updated = await updatePillScheduleApi(entry.id, {
      ...buildRequestBase(wardId, data),
      pillName: mealTypeToPillName(data.mealType),
      active: entry.enabled,
      isActive: entry.enabled,
    });
    upsertMedicationEntry(wardId, pillScheduleToEntry(updated));
  },

  deleteMedication: async (wardId, id) => {
    await deletePillScheduleApi(id);
    removeMedicationEntry(wardId, id);
  },

  toggleEnabled: async (wardId, id) => {
    if (get().togglingIds.has(id)) return;
    const current = get().medicationsByWard[wardId]?.find(item => item.id === id);
    if (!current) return;
    set(state => ({ togglingIds: new Set(state.togglingIds).add(id) }));
    try {
      const updated = await togglePillScheduleApi(id, !current.enabled);
      set(state => ({
        medicationsByWard: {
          ...state.medicationsByWard,
          [wardId]: (state.medicationsByWard[wardId] ?? []).map(item =>
            item.id === id ? pillScheduleToEntry(updated) : item,
          ),
        },
      }));
    } finally {
      set(state => {
        const next = new Set(state.togglingIds);
        next.delete(id);
        return { togglingIds: next };
      });
    }
  },
}));

resetOnLogout(useMedicationListStore);
