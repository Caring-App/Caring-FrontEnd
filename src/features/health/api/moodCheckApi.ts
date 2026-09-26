import axios from 'axios';
import { axiosInstance } from '@shared/api/axiosInstance';
import { MoodCheckRecord, MoodCheckRequest, MoodStatus } from '../model/moodTypes';

// [오늘의 건강(기분) 상태 기록] — 돌봄대상자 자신의 오늘 상태 등록/갱신
export const checkMoodApi = async (moodStatus: MoodStatus): Promise<void> => {
  const payload: MoodCheckRequest = { moodStatus };
  await axiosInstance.post('/api/mood-check', payload);
};

// 백엔드 변경(기록 없음 → 200+null/204) 반영 전 서버는 기록이 없을 때 400(IllegalArgumentException)을 줌.
// 권한 없음 등 진짜 400과 구분하려고 메시지까지 비교함 — TODO: 변경 배포 확인되면 이 분기는 제거.
const NO_RECORD_TODAY_MESSAGE = '아직 오늘의 기록이 없습니다.';

function isNoRecordTodayError(error: unknown) {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 400 &&
    error.response.data?.message === NO_RECORD_TODAY_MESSAGE
  );
}

// 오늘 기록이 없을 때 백엔드가 200+null 또는 204로 주기로 함(요청해둔 변경) — 204면 axios가 data를
// 빈 문자열로 줄 수 있어서 둘 다 null(기록 없음)로 통일
function toMoodCheckRecordOrNull(data: MoodCheckRecord | null | ''): MoodCheckRecord | null {
  return data || null;
}

// [오늘의 건강(기분) 상태 조회] — 보호자가 특정 어르신의 오늘 상태를 조회, 오늘 기록이 없으면 null
export const getMoodCheckApi = async (wardId: number): Promise<MoodCheckRecord | null> => {
  try {
    const { data } = await axiosInstance.get<MoodCheckRecord | null | ''>(`/api/mood-check/${wardId}`);
    return toMoodCheckRecordOrNull(data);
  } catch (error) {
    if (isNoRecordTodayError(error)) return null;
    throw error;
  }
};
