import type { SoundType, TimeState } from '@shared/types';

export type { TimeState };

export type ScheduleSoundType = SoundType;

export interface ScheduleRegistrationData {
  title: string;
  location: string;
  date: Date;
  scheduleTime: TimeState;
  alarmTime: TimeState;
  soundType: ScheduleSoundType;
}

export interface ScheduleEntry extends ScheduleRegistrationData {
  id: string;
}
