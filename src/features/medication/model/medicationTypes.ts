import type { SoundType, TimeState } from '@shared/types';

export type MealType = 'morning' | 'lunch' | 'dinner';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type MedicationSoundType = SoundType;

// 백엔드 pillName enum. 스웨거에 스키마 탭 없이 예시값(MORNING)만 있어 나머지는 MealType 대응으로 추정.
export type PillName = 'MORNING' | 'LUNCH' | 'DINNER';
export type PillAlarmType = 'TTS' | 'VOICE';

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
  alarmType: PillAlarmType;
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
  alarmType: PillAlarmType;
  voiceFileUrl: string;
  active: boolean;
  isActive: boolean;
}

export interface MedicationRegistrationData {
  mealTypes: MealType[];
  days: Weekday[];
  time: TimeState;
  reminderInterval: string;
  soundType: MedicationSoundType;
}

// 화면에 그려지는 항목 = 백엔드 스케줄 1건(pillScheduleId 1개, 시간대 1개).
// 등록/수정 시 mealTypes를 여러 개 선택하면 여러 건으로 분해되어 저장됨 (useMedicationListStore 참고).
export interface MedicationEntry {
  id: number;
  mealType: MealType;
  days: Weekday[];
  time: TimeState;
  reminderInterval: string;
  soundType: MedicationSoundType;
  enabled: boolean;
}
