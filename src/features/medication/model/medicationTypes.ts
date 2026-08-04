import type { TimeState } from '@shared/types';

export type MealType = 'morning' | 'lunch' | 'dinner';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type MedicationSoundType = 'tts' | 'voice';

export interface MedicationRegistrationData {
  name: string;
  mealTypes: MealType[];
  days: Weekday[];
  time: TimeState;
  reminderInterval: string;
  soundType: MedicationSoundType;
}

export interface MedicationEntry extends MedicationRegistrationData {
  id: string;
  enabled: boolean;
}
