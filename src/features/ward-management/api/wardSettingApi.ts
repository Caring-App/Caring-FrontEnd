import { axiosInstance } from '@shared/api/axiosInstance';
import { TTS_RESYNTHESIS_TIMEOUT_MS } from '@shared/api/timeouts';
import { UpdateWardSettingRequest, WardSetting } from '../model/types';

// [어르신 화면 설정 조회] — 글자 크기 / TTS 재생 속도
export const getWardSettingApi = async (wardId: number): Promise<WardSetting> => {
  const { data } = await axiosInstance.get<WardSetting>(`/api/ward-setting/${wardId}`);
  return data;
};

// [어르신 화면 설정 수정] — TTS 속도가 바뀌면 서버가 그 어르신의 TTS 복약·일정 음성을 전부 다시 만들어서 오래 걸림
export const updateWardSettingApi = async (
  wardId: number,
  payload: UpdateWardSettingRequest,
): Promise<WardSetting> => {
  const { data } = await axiosInstance.patch<WardSetting>(`/api/ward-setting/${wardId}`, payload, {
    timeout: TTS_RESYNTHESIS_TIMEOUT_MS,
  });
  return data;
};
