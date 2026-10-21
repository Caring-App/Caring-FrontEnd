// 백엔드 moodStatus enum (/v3/api-docs의 MoodCheckRequestDto/ResponseDto 기준으로 확인됨)
export type MoodStatus = 'GOOD' | 'NORMAL' | 'BAD';

// POST /api/mood-check 요청 바디. 인증 토큰으로 본인(WARD)을 식별하므로 wardId는 없음.
export interface MoodCheckRequest {
  moodStatus: MoodStatus;
}

// GET /api/mood-check/{wardId} 응답
export interface MoodCheckRecord {
  moodStatus: MoodStatus;
  recordDate: string;
  checkedAt: string;
}
