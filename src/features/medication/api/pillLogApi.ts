import { axiosInstance } from '@shared/api/axiosInstance';
import { PillLog, PillToday } from '../model/medicationTypes';

// [오늘 복약 목록 + 복용 여부] — 어르신(WARD) 토큰 기준, wardId는 서버가 토큰에서 꺼냄
export const getTodayPillsApi = async (): Promise<PillToday[]> => {
  const { data } = await axiosInstance.get<PillToday[]>('/api/pill/today');
  return data;
};

// [복용 확인] — 한 번 확인하면 되돌리는 API는 없음(이미 확인된 기록이면 서버가 에러). 성공 시 보호자에게 푸시 알림이 감
export const confirmPillApi = async (pillLogId: number): Promise<PillLog> => {
  const { data } = await axiosInstance.post<PillLog>('/api/pill/confirm', { pillLogId });
  return data;
};
