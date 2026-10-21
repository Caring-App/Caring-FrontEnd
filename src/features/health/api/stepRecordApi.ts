import { axiosInstance } from '@shared/api/axiosInstance';
import { StepRecordResponse } from '../model/reportTypes';

// [오늘 걸음 수 기록] — 어르신 기기에서 오늘 누적 걸음 수를 보냄(하루 1건, 보낼 때마다 덮어씀).
// 레포트 시각(마감) 이후에는 서버가 400
export const recordStepsApi = async (steps: number): Promise<void> => {
  await axiosInstance.post('/api/step-record', { steps });
};

// [오늘 걸음 수] — 보호자. 오늘 기록이 없으면 서버가 본문 없이 줘서 null로 통일
export const getTodayStepsApi = async (wardId: number): Promise<StepRecordResponse | null> => {
  const { data } = await axiosInstance.get<StepRecordResponse | ''>(`/api/step-record/${wardId}`);
  return data || null;
};
