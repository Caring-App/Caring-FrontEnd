import { axiosInstance } from '@shared/api/axiosInstance';
import { UpdateWardSettingRequest, WardSetting } from '../model/types';

// [어르신 화면 설정 조회] — 글자 크기 / TTS 재생 속도
export const getWardSettingApi = async (wardId: number): Promise<WardSetting> => {
  const { data } = await axiosInstance.get<WardSetting>(`/api/ward-setting/${wardId}`);
  return data;
};

// [어르신 화면 설정 수정]
export const updateWardSettingApi = async (
  wardId: number,
  payload: UpdateWardSettingRequest,
): Promise<WardSetting> => {
  const { data } = await axiosInstance.patch<WardSetting>(`/api/ward-setting/${wardId}`, payload);
  return data;
};
