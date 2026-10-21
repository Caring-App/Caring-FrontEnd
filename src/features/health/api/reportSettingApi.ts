import { axiosInstance } from '@shared/api/axiosInstance';
import { ReportTimeResponse } from '../model/reportTypes';

// [레포트 시각 조회] — 보호자. 설정이 없으면 서버가 기본값(21:00)을 줌
export const getReportTimeApi = async (wardId: number): Promise<ReportTimeResponse> => {
  const { data } = await axiosInstance.get<ReportTimeResponse>(`/api/report-setting/${wardId}`);
  return data;
};

// [레포트 시각 변경] — 보호자. reportTime은 'HH:mm'. 이 시각은 어르신의 기분·건강 수치·걸음 수 기록 마감 시각이기도 함
export const updateReportTimeApi = async (wardId: number, reportTime: string): Promise<void> => {
  await axiosInstance.patch(`/api/report-setting/${wardId}`, { reportTime });
};
