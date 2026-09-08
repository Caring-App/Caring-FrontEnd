import type { SoundType, TimeState } from '@shared/types';

export type { TimeState };

export type ScheduleSoundType = SoundType;

export interface ScheduleRegistrationData {
  title: string;
  location: string;
  // @features/place에 등록된 실제 장소의 id — 장소는 이제 자유 텍스트가 아니라 이 도메인에서 고른 값.
  placeId: number;
  date: Date;
  scheduleTime: TimeState;
  alarmTime: TimeState;
  soundType: ScheduleSoundType;
}

export interface ScheduleEntry extends ScheduleRegistrationData {
  id: number;
}
