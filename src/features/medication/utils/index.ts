import type { TimeState } from '@shared/types';
import {
  MealType,
  MedicationEntry,
  MedicationSoundType,
  PillAlarmType,
  PillName,
  PillSchedule,
  Weekday,
} from '../model/medicationTypes';

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

export const MEAL_TYPE_LABELS: Record<MealType, string> = { morning: '아침', lunch: '점심', dinner: '저녁' };

const MEAL_TYPE_TO_PILL_NAME: Record<MealType, PillName> = { morning: 'MORNING', lunch: 'LUNCH', dinner: 'DINNER' };
const PILL_NAME_TO_MEAL_TYPE: Record<PillName, MealType> = { MORNING: 'morning', LUNCH: 'lunch', DINNER: 'dinner' };

export function mealTypeToPillName(mealType: MealType): PillName {
  return MEAL_TYPE_TO_PILL_NAME[mealType];
}

export function pillNameToMealType(pillName: PillName): MealType {
  const mealType = PILL_NAME_TO_MEAL_TYPE[pillName];
  if (!mealType) {
    // pillName이 추정한 3개 값(MORNING/LUNCH/DINNER) 밖이면 'morning'으로 임시 표시하는데, 이 상태로
    // 다시 저장하면 실제 시간대가 아침으로 덮어써질 위험이 있음 — 조용히 넘기지 말고 눈에 띄게 남겨둠.
    console.error(`[medication] 알 수 없는 pillName 값: ${pillName}`);
    return 'morning';
  }
  return mealType;
}

const WEEKDAY_CODE: Record<Weekday, string> = {
  mon: 'MON',
  tue: 'TUE',
  wed: 'WED',
  thu: 'THU',
  fri: 'FRI',
  sat: 'SAT',
  sun: 'SUN',
};
const CODE_TO_WEEKDAY: Record<string, Weekday> = {
  MON: 'mon',
  TUE: 'tue',
  WED: 'wed',
  THU: 'thu',
  FRI: 'fri',
  SAT: 'sat',
  SUN: 'sun',
};

// takeDays 포맷은 스웨거에 "string"으로만 나와 있어 형식이 명시돼있지 않음 — 콤마로 구분된 영문 3글자 코드로 가정.
export function daysToTakeDays(days: Weekday[]): string {
  return WEEKDAY_ORDER.filter(day => days.includes(day))
    .map(day => WEEKDAY_CODE[day])
    .join(',');
}

export function takeDaysToDays(takeDays: string): Weekday[] {
  return takeDays
    .split(',')
    .map(code => CODE_TO_WEEKDAY[code.trim()])
    .filter((day): day is Weekday => Boolean(day));
}

// takeTime도 형식이 명시돼있지 않아 24시간제 "HH:mm"으로 가정.
export function timeStateToTakeTime({ hour, minute, amPm }: TimeState): string {
  const hour24 = (Number(hour) % 12) + (amPm === 'PM' ? 12 : 0);
  return `${String(hour24).padStart(2, '0')}:${minute}`;
}

export function takeTimeToTimeState(takeTime: string): TimeState {
  const [hourStr, minuteStr] = takeTime.split(':');
  const hour24 = Number(hourStr) || 0;
  const amPm: TimeState['amPm'] = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour: String(hour12).padStart(2, '0'), minute: minuteStr ?? '00', second: '00', amPm };
}

const REMINDER_MINUTES: Record<string, number> = {
  '5분 후': 5,
  '10분 후': 10,
  '15분 후': 15,
  '20분 후': 20,
  '30분 후': 30,
  '1시간 후': 60,
};

export function reminderIntervalToMinutes(interval: string): number {
  return REMINDER_MINUTES[interval] ?? 10;
}

export function minutesToReminderInterval(minutes: number): string {
  return Object.keys(REMINDER_MINUTES).find(key => REMINDER_MINUTES[key] === minutes) ?? '10분 후';
}

export function soundTypeToAlarmType(soundType: MedicationSoundType): PillAlarmType {
  return soundType === 'voice' ? 'VOICE' : 'TTS';
}

export function alarmTypeToSoundType(alarmType: PillAlarmType): MedicationSoundType {
  return alarmType === 'VOICE' ? 'voice' : 'tts';
}

export function pillScheduleToEntry(schedule: PillSchedule): MedicationEntry {
  return {
    id: schedule.pillScheduleId,
    mealType: pillNameToMealType(schedule.pillName),
    days: takeDaysToDays(schedule.takeDays),
    time: takeTimeToTimeState(schedule.takeTime),
    reminderInterval: minutesToReminderInterval(schedule.retryAlarm),
    soundType: alarmTypeToSoundType(schedule.alarmType),
    enabled: schedule.active,
  };
}
