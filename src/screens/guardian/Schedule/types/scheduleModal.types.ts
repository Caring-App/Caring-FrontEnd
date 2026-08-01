export interface ScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: ScheduleRegistrationData) => void;
}

export interface TimeState {
  hour: string;
  minute: string;
  second: string;
  amPm: 'AM' | 'PM';
}

export type SoundType = 'tts' | 'voice';

export interface ScheduleRegistrationData {
  title: string;
  location: string;
  selectedDate: Date;
  scheduleTime: TimeState;
  alertTime: TimeState;
  soundType: SoundType;
  hasRecorded: boolean;
}