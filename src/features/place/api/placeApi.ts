import { axiosInstance } from '@shared/api/axiosInstance';
import { Place, PlaceRequest } from '../model/placeTypes';

// [자주 가는 장소 목록 조회] — 어르신 1명의 등록된 장소 전체 조회
export const getPlacesApi = async (wardId: number): Promise<Place[]> => {
  const { data } = await axiosInstance.get<Place[]>(`/api/place/${wardId}`);
  return data;
};

// [자주 가는 장소 등록]
export const createPlaceApi = async (payload: PlaceRequest): Promise<Place> => {
  const { data } = await axiosInstance.post<Place>('/api/place', payload);
  return data;
};

// [자주 가는 장소 삭제]
export const deletePlaceApi = async (placeId: number): Promise<void> => {
  await axiosInstance.delete(`/api/place/${placeId}`);
};
