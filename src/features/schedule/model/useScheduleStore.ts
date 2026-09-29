import { create } from 'zustand';
import { resetOnLogout } from '@shared/store/resetOnLogout';
import { logApiError } from '@shared/api';
import { notifyLoadFailed } from '@shared/model';
import {
  createTaskScheduleApi,
  deleteTaskScheduleApi,
  getMyTodayTaskSchedulesApi,
  getTaskSchedulesApi,
  updateTaskScheduleApi,
} from '../api/taskScheduleApi';
import { buildTaskScheduleRequest, dateToTaskDate, taskScheduleToEntry } from '../utils';
import { ScheduleEntry, ScheduleRegistrationData } from './scheduleRegistrationTypes';

interface ScheduleState {
  schedulesByWard: Record<string, ScheduleEntry[]>;
  isLoading: boolean;
  // 돌봄대상자(WARD) 본인 화면 전용 — 보호자용 schedulesByWard와 조회 API가 달라서 따로 둠
  myTodaySchedules: ScheduleEntry[];
  // month가 속한 달(1일~말일)의 일정을 조회해 schedulesByWard[wardId]를 그 달 목록으로 교체
  fetchSchedules: (wardId: string, month: Date) => Promise<void>;
  fetchMyTodaySchedules: () => Promise<void>;
  addSchedule: (wardId: string, data: ScheduleRegistrationData) => Promise<void>;
  updateSchedule: (wardId: string, id: number, data: ScheduleRegistrationData) => Promise<void>;
  deleteSchedule: (wardId: string, id: number) => Promise<void>;
}

// 달을 빠르게 넘기면 이전 달 응답이 늦게 도착해 최신 달 목록을 덮어쓸 수 있어서, 어르신별로 마지막 요청만 반영함
const latestRequestIdByWard = new Map<string, number>();

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedulesByWard: {},
  isLoading: false,
  myTodaySchedules: [],

  fetchSchedules: async (wardId, month) => {
    const requestId = (latestRequestIdByWard.get(wardId) ?? 0) + 1;
    latestRequestIdByWard.set(wardId, requestId);
    set({ isLoading: true });
    try {
      const schedules = await getTaskSchedulesApi(Number(wardId), {
        startDate: dateToTaskDate(new Date(month.getFullYear(), month.getMonth(), 1)),
        endDate: dateToTaskDate(new Date(month.getFullYear(), month.getMonth() + 1, 0)),
      });
      if (latestRequestIdByWard.get(wardId) !== requestId) return;
      set((state) => ({
        schedulesByWard: { ...state.schedulesByWard, [wardId]: schedules.map(taskScheduleToEntry) },
      }));
    } catch (error) {
      logApiError('일정 목록 조회 실패', error);
      notifyLoadFailed();
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyTodaySchedules: async () => {
    try {
      const schedules = await getMyTodayTaskSchedulesApi();
      set({ myTodaySchedules: schedules.map(taskScheduleToEntry) });
    } catch (error) {
      logApiError('오늘 일정 조회 실패', error);
      notifyLoadFailed();
    }
  },

  addSchedule: async (wardId, data) => {
    const created = await createTaskScheduleApi(Number(wardId), buildTaskScheduleRequest(data));
    set((state) => ({
      schedulesByWard: {
        ...state.schedulesByWard,
        [wardId]: [...(state.schedulesByWard[wardId] ?? []), taskScheduleToEntry(created)],
      },
    }));
  },

  updateSchedule: async (wardId, id, data) => {
    const updated = await updateTaskScheduleApi(id, buildTaskScheduleRequest(data));
    set((state) => ({
      schedulesByWard: {
        ...state.schedulesByWard,
        [wardId]: (state.schedulesByWard[wardId] ?? []).map((entry) =>
          entry.id === id ? taskScheduleToEntry(updated) : entry,
        ),
      },
    }));
  },

  deleteSchedule: async (wardId, id) => {
    await deleteTaskScheduleApi(id);
    set((state) => ({
      schedulesByWard: {
        ...state.schedulesByWard,
        [wardId]: (state.schedulesByWard[wardId] ?? []).filter((entry) => entry.id !== id),
      },
    }));
  },
}));

resetOnLogout(useScheduleStore);
