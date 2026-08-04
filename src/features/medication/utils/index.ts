import { MedicationEntry } from '../model/medicationTypes';

export function formatMedicationTime({ hour, minute, period }: MedicationEntry['time']) {
  const periodLabel = period === 'AM' ? '오전' : '오후';
  return `${periodLabel} ${hour}:${minute}`;
}

export function formatMealTiming({ mealTiming, mealOffsetMinutes }: Pick<MedicationEntry, 'mealTiming' | 'mealOffsetMinutes'>) {
  const timingLabel = mealTiming === 'after' ? '식후' : '식전';
  return `${timingLabel} ${mealOffsetMinutes}분`;
}
