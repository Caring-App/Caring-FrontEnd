import axios from 'axios';
import { axiosInstance } from '@shared/api/axiosInstance';
import { DailyReportResponse } from '../model/reportTypes';

// 레포트 시각 전이라 오늘 레포트가 아직 없을 때 백엔드가 주는 400 메시지(DailyReportService.getTodayReport).
// 권한 없음 등 다른 400과 구분하려고 메시지까지 비교함
const REPORT_NOT_READY_MESSAGE = '오늘의 리포트가 존재하지 않습니다';

function isReportNotReadyError(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 400 &&
    error.response.data?.message === REPORT_NOT_READY_MESSAGE
  );
}

// [오늘 하루 요약 레포트] — 보호자. 아직 만들어지지 않았으면 null
export const getTodayDailyReportApi = async (wardId: number): Promise<DailyReportResponse | null> => {
  try {
    const { data } = await axiosInstance.get<DailyReportResponse>(`/api/daily-report/${wardId}/today`);
    return data;
  } catch (error) {
    if (isReportNotReadyError(error)) return null;
    throw error;
  }
};
