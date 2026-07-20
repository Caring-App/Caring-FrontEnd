export interface MedicationFormState {
  medicationName: string;
  timeCategory: '아침' | '점심' | '저녁';
  selectedDays: string[];
  medTime: {
    hour: string;
    minute: string;
    second: string;
    amPm: 'AM' | 'PM';
  };
  remindInterval: string;
  soundType: 'tts' | 'voice';
  hasRecorded: boolean;
}

export interface MedicationRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: MedicationFormState) => void;
}