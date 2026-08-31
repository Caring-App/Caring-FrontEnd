import { axiosInstance } from '@shared/api/axiosInstance';
import { WardLocation } from '../model/types';

// [어르신 최신 위치 조회]
export const getWardLatestLocationApi = async (wardId: number): Promise<WardLocation> => {
  const { data } = await axiosInstance.get<WardLocation>(`/api/location/${wardId}/latest`);
  return data;
};
