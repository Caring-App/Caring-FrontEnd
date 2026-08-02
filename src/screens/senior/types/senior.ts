export type EmotionType = 'happy' | 'neutral' | 'sad' | null;

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
}

export interface MedicationStatus {
  morning: boolean;
  lunch: boolean;
  dinner: boolean;
}