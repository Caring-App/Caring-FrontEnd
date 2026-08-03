export interface TimeState {
  hour: string;
  minute: string;
  second: string;
  amPm: 'AM' | 'PM';
}

export type ScheduleSoundType = 'tts' | 'voice';

export interface ScheduleRegistrationData {
  title: string;
  location: string;
  date: Date;
  scheduleTime: TimeState;
  alarmTime: TimeState;
  soundType: ScheduleSoundType;
}
