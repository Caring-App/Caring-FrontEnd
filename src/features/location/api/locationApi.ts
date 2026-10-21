import { axiosInstance } from '@shared/api/axiosInstance';
import { WardLocation } from '../model/types';

// [어르신 최신 위치 조회]
export const getWardLatestLocationApi = async (wardId: number): Promise<WardLocation> => {
  const { data } = await axiosInstance.get<WardLocation>(`/api/location/${wardId}/latest`);
  return data;
};

// [어르신 위치 보고] — 어르신(WARD) 기기가 자신의 현재 좌표를 보고함. 토큰으로 본인을 식별하므로
// body에 wardId는 없음.
export const reportWardLocationApi = async (latitude: number, longitude: number): Promise<WardLocation> => {
  const { data } = await axiosInstance.post<WardLocation>('/api/location', { latitude, longitude });
  return data;
};
