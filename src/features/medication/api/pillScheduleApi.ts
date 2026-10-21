import { axiosInstance } from '@shared/api/axiosInstance';
import { SLOW_REQUEST_TIMEOUT_MS } from '@shared/api/timeouts';
import { PillSchedule, PillScheduleRequest } from '../model/medicationTypes';

// [복약 스케줄 목록] — 어르신 1명의 등록된 복약 스케줄 전체 조회
export const getPillSchedulesApi = async (wardId: number): Promise<PillSchedule[]> => {
  const { data } = await axiosInstance.get<PillSchedule[]>(`/api/pill/schedule/${wardId}`);
  return data;
};

// [복약 스케줄 등록] — 기본 알림음(TTS)이면 서버가 저장하면서 음성 파일을 2개(처음·재알림) 만들어 올려서 5초를 넘기기 쉬움
export const createPillScheduleApi = async (payload: PillScheduleRequest): Promise<PillSchedule> => {
  const { data } = await axiosInstance.post<PillSchedule>('/api/pill/schedule', payload, {
    timeout: SLOW_REQUEST_TIMEOUT_MS,
  });
  return data;
};

// [복약 스케줄 수정] — 등록과 같은 이유로 타임아웃을 늘림
export const updatePillScheduleApi = async (id: number, payload: PillScheduleRequest): Promise<PillSchedule> => {
  const { data } = await axiosInstance.put<PillSchedule>(`/api/pill/schedule/${id}`, payload, {
    timeout: SLOW_REQUEST_TIMEOUT_MS,
  });
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
