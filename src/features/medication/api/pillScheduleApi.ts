import { axiosInstance } from '@shared/api/axiosInstance';
import { PillSchedule, PillScheduleRequest } from '../model/medicationTypes';

// [복약 스케줄 목록] — 어르신 1명의 등록된 복약 스케줄 전체 조회
export const getPillSchedulesApi = async (wardId: number): Promise<PillSchedule[]> => {
  const { data } = await axiosInstance.get<PillSchedule[]>(`/api/pill/schedule/${wardId}`);
  return data;
};

// [복약 스케줄 등록]
export const createPillScheduleApi = async (payload: PillScheduleRequest): Promise<PillSchedule> => {
  const { data } = await axiosInstance.post<PillSchedule>('/api/pill/schedule', payload);
  return data;
};

// [복약 스케줄 수정]
export const updatePillScheduleApi = async (id: number, payload: PillScheduleRequest): Promise<PillSchedule> => {
  const { data } = await axiosInstance.put<PillSchedule>(`/api/pill/schedule/${id}`, payload);
  return data;
};

// [복약 스케줄 삭제]
export const deletePillScheduleApi = async (id: number): Promise<PillSchedule> => {
  const { data } = await axiosInstance.delete<PillSchedule>(`/api/pill/schedule/${id}`);
  return data;
};

// [복약 스케줄 활성/비활성 토글]
export const togglePillScheduleApi = async (id: number, isActive: boolean): Promise<PillSchedule> => {
  const { data } = await axiosInstance.patch<PillSchedule>(`/api/pill/schedule/${id}/toggle`, null, {
    params: { isActive },
  });
  return data;
};
