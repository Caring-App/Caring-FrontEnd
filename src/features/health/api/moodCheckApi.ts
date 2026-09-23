import { axiosInstance } from '@shared/api/axiosInstance';
import { MoodCheckRecord, MoodCheckRequest, MoodStatus } from '../model/moodTypes';

// [오늘의 건강(기분) 상태 기록] — 돌봄대상자 자신의 오늘 상태 등록/갱신
export const checkMoodApi = async (moodStatus: MoodStatus): Promise<void> => {
  const payload: MoodCheckRequest = { moodStatus };
  await axiosInstance.post('/api/mood-check', payload);
};

// [오늘의 건강(기분) 상태 조회] — 보호자가 특정 어르신의 오늘 상태를 조회
export const getMoodCheckApi = async (wardId: number): Promise<MoodCheckRecord> => {
  const { data } = await axiosInstance.get<MoodCheckRecord>(`/api/mood-check/${wardId}`);
  return data;
};
