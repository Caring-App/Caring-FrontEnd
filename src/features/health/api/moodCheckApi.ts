import { axiosInstance } from '@shared/api/axiosInstance';
import { MoodCheckRecord, MoodCheckRequest, MoodStatus } from '../model/moodTypes';

// [오늘의 건강(기분) 상태 기록] — 돌봄대상자 자신의 오늘 상태 등록/갱신
export const checkMoodApi = async (moodStatus: MoodStatus): Promise<void> => {
  const payload: MoodCheckRequest = { moodStatus };
  await axiosInstance.post('/api/mood-check', payload);
};

// 오늘 기록이 없으면 백엔드가 204(No Content)를 줌(MoodCheckController) — axios는 이때 data를 빈 문자열로
// 줄 수 있어서 null(기록 없음)로 통일
function toMoodCheckRecordOrNull(data: MoodCheckRecord | null | ''): MoodCheckRecord | null {
  return data || null;
}

// [오늘의 건강(기분) 상태 조회] — 보호자가 특정 어르신의 오늘 상태를 조회, 오늘 기록이 없으면 null
export const getMoodCheckApi = async (wardId: number): Promise<MoodCheckRecord | null> => {
  const { data } = await axiosInstance.get<MoodCheckRecord | null | ''>(`/api/mood-check/${wardId}`);
  return toMoodCheckRecordOrNull(data);
};

// [본인 오늘의 건강(기분) 상태 조회] — 돌봄대상자 전용. 토큰으로 본인을 식별, 오늘 기록이 없으면 null
export const getMyMoodCheckApi = async (): Promise<MoodCheckRecord | null> => {
  const { data } = await axiosInstance.get<MoodCheckRecord | null | ''>('/api/mood-check/me');
  return toMoodCheckRecordOrNull(data);
};
