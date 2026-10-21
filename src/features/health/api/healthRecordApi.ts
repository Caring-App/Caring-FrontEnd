import { axiosInstance } from '@shared/api/axiosInstance';
import { HealthGraphResponse, HealthRecordRequest, HealthRecordResponse } from '../model/reportTypes';

// [건강 수치 기록] — 어르신 본인. 레포트 시각(마감) 이후에는 서버가 400("지금은 건강 수치를 입력할 수 없습니다.")
export const recordHealthApi = async (payload: HealthRecordRequest): Promise<void> => {
  await axiosInstance.post('/api/health-record', payload);
};

// [오늘 건강 수치 기록 목록] — 보호자
export const getTodayHealthRecordsApi = async (wardId: number): Promise<HealthRecordResponse[]> => {
  const { data } = await axiosInstance.get<HealthRecordResponse[]>(`/api/health-record/${wardId}`);
  return data ?? [];
};

// [기간별 건강 수치 그래프] — 보호자. 날짜는 'YYYY-MM-DD'
export const getHealthGraphApi = async (
  wardId: number,
  startDate: string,
  endDate: string,
): Promise<HealthGraphResponse> => {
  const { data } = await axiosInstance.get<HealthGraphResponse>(`/api/health-record/${wardId}/graph`, {
    params: { startDate, endDate },
  });
  return data;
};
