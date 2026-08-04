export type MedicationTimePeriod = 'AM' | 'PM';

export interface MedicationTime {
  hour: string;
  minute: string;
  period: MedicationTimePeriod;
}

export type MealTiming = 'before' | 'after';

export interface MedicationRegistrationData {
  name: string;
  time: MedicationTime;
  mealTiming: MealTiming;
  mealOffsetMinutes: number;
  enabled: boolean;
}

export interface MedicationEntry extends MedicationRegistrationData {
  id: string;
}
