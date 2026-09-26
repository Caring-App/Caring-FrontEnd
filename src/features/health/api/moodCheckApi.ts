import axios from 'axios';
import { axiosInstance } from '@shared/api/axiosInstance';
import { MoodCheckRecord, MoodCheckRequest, MoodStatus } from '../model/moodTypes';

// [오늘의 건강(기분) 상태 기록] — 돌봄대상자 자신의 오늘 상태 등록/갱신
export const checkMoodApi = async (moodStatus: MoodStatus): Promise<void> => {
  const payload: MoodCheckRequest = { moodStatus };
  await axiosInstance.post('/api/mood-check', payload);
};

// 어르신이 오늘 아직 상태를 안 눌렀을 때도 백엔드가 200+빈 값 대신 400(IllegalArgumentException)을 줌.
// 권한 없음 등 진짜 400과 구분하려고 메시지까지 비교함 — 백엔드가 200/204로 바꿔주면 이 분기는 제거.
const NO_RECORD_TODAY_MESSAGE = '아직 오늘의 기록이 없습니다.';

function isNoRecordTodayError(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 400 &&
    error.response.data?.message === NO_RECORD_TODAY_MESSAGE
  );
}

// [오늘의 건강(기분) 상태 조회] — 보호자가 특정 어르신의 오늘 상태를 조회, 오늘 기록이 없으면 null
export const getMoodCheckApi = async (wardId: number): Promise<MoodCheckRecord | null> => {
  try {
    const { data } = await axiosInstance.get<MoodCheckRecord>(`/api/mood-check/${wardId}`);
    return data;
  } catch (error) {
    if (isNoRecordTodayError(error)) return null;
    throw error;
  }
};
