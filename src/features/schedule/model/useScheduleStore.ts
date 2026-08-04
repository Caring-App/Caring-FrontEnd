import { create } from 'zustand';
import { ScheduleEntry, ScheduleRegistrationData } from './scheduleRegistrationTypes';

interface ScheduleState {
  schedulesByWard: Record<string, ScheduleEntry[]>;
  addSchedule: (wardId: string, data: ScheduleRegistrationData) => void;
  updateSchedule: (wardId: string, id: string, data: ScheduleRegistrationData) => void;
  deleteSchedule: (wardId: string, id: string) => void;
}

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedulesByWard: {},
  addSchedule: (wardId, data) =>
    set((state) => ({
      schedulesByWard: {
        ...state.schedulesByWard,
        [wardId]: [...(state.schedulesByWard[wardId] ?? []), { ...data, id: createId() }],
      },
    })),
  updateSchedule: (wardId, id, data) =>
    set((state) => ({
      schedulesByWard: {
        ...state.schedulesByWard,
        [wardId]: (state.schedulesByWard[wardId] ?? []).map((entry) =>
          entry.id === id ? { ...data, id } : entry,
        ),
      },
    })),
  deleteSchedule: (wardId, id) =>
    set((state) => ({
      schedulesByWard: {
        ...state.schedulesByWard,
        [wardId]: (state.schedulesByWard[wardId] ?? []).filter((entry) => entry.id !== id),
      },
    })),
}));
