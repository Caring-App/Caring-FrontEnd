import { axiosInstance } from '@shared/api/axiosInstance';
import {
  ConnectionDetail,
  ConnectionSummary,
  LinkConnectionRequest,
  LinkConnectionResponse,
  UpdateConnectionRequest,
} from '../model/types';

// [연동된 돌봄대상자 목록] — 보호자가 자신에게 연동된 돌봄대상자들을 조회
export const getConnectionsApi = async (): Promise<ConnectionSummary[]> => {
  const { data } = await axiosInstance.get<ConnectionSummary[]>('/api/connection');
  return data;
};

// [연동 요청] — 돌봄대상자가 보호자의 연동 코드를 입력해 연동
export const linkConnectionApi = async (payload: LinkConnectionRequest): Promise<LinkConnectionResponse> => {
  const { data } = await axiosInstance.post<LinkConnectionResponse>('/api/connection', payload);
  return data;
};

// [연동된 돌봄대상자 상세 조회]
export const getConnectionDetailApi = async (wardId: number): Promise<ConnectionDetail> => {
  const { data } = await axiosInstance.get<ConnectionDetail>(`/api/connection/${wardId}`);
  return data;
};

// [연동된 돌봄대상자 정보 수정]
export const updateConnectionApi = async (
  wardId: number,
  payload: UpdateConnectionRequest,
): Promise<ConnectionDetail> => {
  const { data } = await axiosInstance.patch<ConnectionDetail>(`/api/connection/${wardId}`, payload);
  return data;
};
