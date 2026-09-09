import { create } from 'zustand';
import { logApiError } from '@shared/api';
import {
  createTaskScheduleApi,
  deleteTaskScheduleApi,
  getTaskSchedulesApi,
  updateTaskScheduleApi,
} from '../api/taskScheduleApi';
import { buildTaskScheduleRequest, taskScheduleToEntry } from '../utils';
import { ScheduleEntry, ScheduleRegistrationData } from './scheduleRegistrationTypes';

interface ScheduleState {
  schedulesByWard: Record<string, ScheduleEntry[]>;
  isLoading: boolean;
  fetchSchedules: (wardId: string) => Promise<void>;
  addSchedule: (wardId: string, data: ScheduleRegistrationData) => Promise<void>;
  updateSchedule: (wardId: string, id: number, data: ScheduleRegistrationData) => Promise<void>;
  deleteSchedule: (wardId: string, id: number) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedulesByWard: {},
  isLoading: false,

  fetchSchedules: async (wardId) => {
    set({ isLoading: true });
    try {
      const schedules = await getTaskSchedulesApi(Number(wardId));
      set((state) => ({
        schedulesByWard: { ...state.schedulesByWard, [wardId]: schedules.map(taskScheduleToEntry) },
      }));
    } catch (error) {
      logApiError('일정 목록 조회 실패', error);
    } finally {
      set({ isLoading: false });
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
