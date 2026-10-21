import type { AlarmType, SoundType, TimeState } from '@shared/types';

export type MealType = 'morning' | 'lunch' | 'dinner';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type MedicationSoundType = SoundType;

// 백엔드 pillName enum. 스웨거에 스키마 탭 없이 예시값(MORNING)만 있어 나머지는 MealType 대응으로 추정.
export type PillName = 'MORNING' | 'LUNCH' | 'DINNER';

// GET/POST/PUT/PATCH 공통 응답 형태 — 스케줄 1건 = 시간대(pillName) 1개.
// 백엔드 모델에 "약 이름" 자유텍스트 필드는 없음(피그마 디자인에도 없음, 사용자 확인 완료).
export interface PillSchedule {
  pillScheduleId: number;
  wardId: number;
  wardName: string;
  pillName: PillName;
  pillNameKr: string;
  takeDays: string;
  takeTime: string;
  retryAlarm: number;
  alarmType: AlarmType;
  voiceFileUrl: string;
  active: boolean;
}

// POST/PUT 요청 바디. 스웨거 예시에 active/isActive가 같이 있어(백엔드 boolean getter 중복 노출로 추정)
// 방어적으로 둘 다 같은 값으로 보냄.
export interface PillScheduleRequest {
  wardId: number;
  pillName: PillName;
  takeDays: string;
  takeTime: string;
  retryAlarm: number;
  alarmType: AlarmType;
  voiceFileUrl: string;
  active: boolean;
  isActive: boolean;
}

// 시간대는 하나만 — 백엔드 스케줄 1건이 시간대 1개라 여러 개 고르면 목록엔 따로 생기는데, 같이 올린 녹음 파일 하나를
// 여러 스케줄이 나눠 써서 한 건을 지우거나 녹음을 바꾸면 서버가 그 파일을 지워 나머지 스케줄 음성까지 사라질 수 있음
export interface MedicationRegistrationData {
  mealType: MealType;
  days: Weekday[];
  time: TimeState;
  reminderInterval: string;
  soundType: MedicationSoundType;
  // 보호자 음성 녹음 파일 URL(POST /api/voice/upload 결과). 기본 알림음(TTS)이면 빈 문자열
  voiceFileUrl: string;
}

// 화면에 그려지는 항목 = 백엔드 스케줄 1건(pillScheduleId 1개, 시간대 1개).
export interface MedicationEntry {
  id: number;
  mealType: MealType;
  days: Weekday[];
  time: TimeState;
  reminderInterval: string;
  soundType: MedicationSoundType;
  voiceFileUrl: string;
  enabled: boolean;
}

// GET /api/pill/today 응답 1건 — 로그인한 어르신의 "오늘 먹어야 할" 복약(켜져 있고 오늘 요일에 해당하는 스케줄만).
// 서버가 날짜별로 pillLog를 새로 만들어서 taken이 매일 false로 시작함.
export interface PillToday {
  pillScheduleId: number;
  pillLogId: number;
  pillName: PillName;
  pillNameKr: string;
  takeTime: string;
  recordDate: string;
  confirmedAt: string | null;
  taken: boolean;
}

// POST /api/pill/confirm 응답
export interface PillLog {
  pillLogId: number;
  pillScheduleId: number;
  recordDate: string;
  confirmedAt: string | null;
  currentRetryCount: number;
  taken: boolean;
}
