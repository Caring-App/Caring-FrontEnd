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
    // TODO: useVoiceRecording이 아직 로컬 스텁이라(실제 파일 업로드 없음) 항상 빈 값으로 보냄 — 녹음 업로드 붙으면 채우기
    voiceFileUrl: '',
  };
}

// 여러 API 호출 중 일부만 실패해도, 이미 성공한 호출은 로컬 상태에 바로 반영해서 서버와 어긋나지
// 않게 함(전부 끝난 뒤 한 번에 반영하면 일부 실패 시 성공한 것까지 유실됨 → 재시도 시 중복 생성 위험).
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

function firstRejection(results: PromiseSettledResult<unknown>[]) {
  return results.find((result): result is PromiseRejectedResult => result.status === 'rejected');
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
    } finally {
      set({ isLoading: false });
    }
  },

  // mealTypes를 여러 개 선택했으면 시간대별로 스케줄을 각각 생성함 (백엔드는 스케줄 1건당 pillName 1개만 허용).
  // 여러 건을 동시에 요청하되, 일부만 실패하더라도 성공한 건은 즉시 로컬 상태에 반영함.
  addMedication: async (wardId, data) => {
    const base = buildRequestBase(wardId, data);
    const results = await Promise.allSettled(
      data.mealTypes.map(async mealType => {
        // 새로 등록하는 스케줄은 항상 켜진 상태로 시작(끄는 건 등록 후 토글로).
        const created = await createPillScheduleApi({
          ...base,
          pillName: mealTypeToPillName(mealType),
          active: true,
          isActive: true,
        });
        upsertMedicationEntry(wardId, pillScheduleToEntry(created));
      }),
    );
    const rejected = firstRejection(results);
    if (rejected) {
      throw rejected.reason;
    }
  },

  // 기존 항목(시간대 1개)을 수정하면서 다른 시간대를 추가로 체크한 경우: 원래 시간대는 PUT으로 업데이트하고
  // 나머지 새로 체크한 시간대는 POST로 별도 스케줄을 새로 만듦. 원래 시간대 체크를 해제했다면 그 스케줄은 삭제.
  // 모든 요청을 동시에 보내고(원래 시간대는 서로 독립적), 실패 여부와 무관하게 성공한 건은 각자 도착하는 대로
  // 바로 로컬 상태에 반영함 — 일부만 실패해도 나머지가 사라지거나 재시도 시 중복 생성되지 않도록.
  updateMedication: async (wardId, entry, data) => {
    const base = buildRequestBase(wardId, data);
    const remaining = [...data.mealTypes];
    const originalIndex = remaining.indexOf(entry.mealType);
    const keepsOriginalSlot = originalIndex !== -1;
    if (keepsOriginalSlot) {
      remaining.splice(originalIndex, 1);
    }

    const tasks: Promise<void>[] = [
      keepsOriginalSlot
        ? // 켜짐/꺼짐 상태는 그대로 유지 — 수정 저장이 토글 상태를 되돌리면 안 됨.
          updatePillScheduleApi(entry.id, {
            ...base,
            pillName: mealTypeToPillName(entry.mealType),
            active: entry.enabled,
            isActive: entry.enabled,
          }).then(updated => upsertMedicationEntry(wardId, pillScheduleToEntry(updated)))
        : deletePillScheduleApi(entry.id).then(() => removeMedicationEntry(wardId, entry.id)),
      // 새로 추가된 시간대는 항상 켜진 상태로 시작.
      ...remaining.map(mealType =>
        createPillScheduleApi({ ...base, pillName: mealTypeToPillName(mealType), active: true, isActive: true }).then(
          created => upsertMedicationEntry(wardId, pillScheduleToEntry(created)),
        ),
      ),
    ];

    const results = await Promise.allSettled(tasks);
    const rejected = firstRejection(results);
    if (rejected) {
      throw rejected.reason;
    }
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
