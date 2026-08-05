import type { TimeState } from '@shared/types';
import { MedicationEntry, Weekday } from '../model/medicationTypes';

export function formatMedicationTime({ hour, minute, amPm }: TimeState) {
  const periodLabel = amPm === 'AM' ? '오전' : '오후';
  return `${periodLabel} ${Number(hour)}:${minute}`;
}

function toMinutesOfDay({ hour, minute, amPm }: TimeState) {
  const hour24 = (Number(hour) % 12) + (amPm === 'PM' ? 12 : 0);
  return hour24 * 60 + Number(minute);
}

export function sortMedicationsByTime(entries: MedicationEntry[]) {
  return [...entries].sort((a, b) => toMinutesOfDay(a.time) - toMinutesOfDay(b.time));
}

const WEEKDAY_ORDER: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const WEEKDAY_LABELS: Record<Weekday, string> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
};
const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri'];
const WEEKEND: Weekday[] = ['sat', 'sun'];

export function isSameDaySet(days: Weekday[], preset: Weekday[]) {
  return days.length === preset.length && preset.every(day => days.includes(day));
}

export function formatDays(days: Weekday[]) {
  if (isSameDaySet(days, WEEKDAY_ORDER)) {
    return '매일';
  }
  if (isSameDaySet(days, WEEKDAYS)) {
    return '주간';
  }
  if (isSameDaySet(days, WEEKEND)) {
    return '주말';
  }
  return WEEKDAY_ORDER.filter(day => days.includes(day))
    .map(day => WEEKDAY_LABELS[day])
    .join(', ');
}
