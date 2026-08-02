export interface TimeState {
  hour: string;
  minute: string;
  second: string;
  amPm: 'AM' | 'PM';
}

export type SoundType = 'tts' | 'voice';

export interface MedicationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}