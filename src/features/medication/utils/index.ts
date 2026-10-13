import type { TimeState } from '@shared/types';
import { alarmTypeToSoundType } from '@shared/utils/alarmType';
import { getLocalDateKey } from '@shared/utils/date';
import {
  MealType,
  MedicationEntry,
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

// 시간대 표시 순서와 라벨 — 복약 관련 화면(어르신 카드, 보호자 홈, 하루 요약, 등록 모달)이 모두 이 값을 씀
export const MEAL_TYPES: MealType[] = ['morning', 'lunch', 'dinner'];
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
    console.log(`[medication] 알 수 없는 pillName 값: ${pillName}`);
    return 'morning';
  }
  return mealType;
}

// takeDays 형식은 백엔드 기준: 매일이면 "EVERYDAY", 아니면 한글 요일을 콤마로 이은 값("월,수,금").
// 서버(오늘 복약 조회·복약 알림 스케줄러)가 takeDays.equals("EVERYDAY") || takeDays.contains("화") 식으로 판단해서
// 이 형식이 아니면 오늘 약 목록에서 빠지고 알림도 안 감
const EVERYDAY = 'EVERYDAY';
// 서버 형식 값 — 화면용 WEEKDAY_LABELS와 지금은 같지만, 화면 표시를 바꿔도 서버 형식이 같이 바뀌지 않게 따로 둠
const TAKE_DAY_CODE: Record<Weekday, string> = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
};
// 예전 앱 버전이 영문 코드("MON,TUE")로 저장한 스케줄도 화면엔 제대로 보이게 읽기만 지원 — 다시 저장하면 위 형식으로 바뀜
const LEGACY_WEEKDAY_CODE: Record<Weekday, string> = {
  mon: 'MON',
  tue: 'TUE',
  wed: 'WED',
  thu: 'THU',
  fri: 'FRI',
  sat: 'SAT',
  sun: 'SUN',
};

export function daysToTakeDays(days: Weekday[]): string {
  if (isSameDaySet(days, WEEKDAY_ORDER)) {
    return EVERYDAY;
  }
  return WEEKDAY_ORDER.filter(day => days.includes(day))
    .map(day => TAKE_DAY_CODE[day])
    .join(',');
}

export function takeDaysToDays(takeDays: string): Weekday[] {
  const value = takeDays.trim().toUpperCase();
  if (value === EVERYDAY) {
    return [...WEEKDAY_ORDER];
  }
  // 서버가 contains로 판단하므로 구분자와 상관없이 요일 글자가 들어있으면 포함으로 봄
  const legacyCodes = value.split(',').map(code => code.trim());
  return WEEKDAY_ORDER.filter(
    day => value.includes(TAKE_DAY_CODE[day]) || legacyCodes.includes(LEGACY_WEEKDAY_CODE[day]),
  );
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

export function pillScheduleToEntry(schedule: PillSchedule): MedicationEntry {
  return {
    id: schedule.pillScheduleId,
    mealType: pillNameToMealType(schedule.pillName),
    days: takeDaysToDays(schedule.takeDays),
    time: takeTimeToTimeState(schedule.takeTime),
    reminderInterval: minutesToReminderInterval(schedule.retryAlarm),
    soundType: alarmTypeToSoundType(schedule.alarmType),
    voiceFileUrl: schedule.voiceFileUrl ?? '',
    enabled: schedule.active,
  };
}

// Date.getDay()(0=일요일) → 복약 스케줄의 요일 값. Weekday가 복약 도메인 타입이라 shared가 아닌 여기에 둠
const JS_DAY_TO_WEEKDAY: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function getTodayWeekday(now = new Date()): Weekday {
  return JS_DAY_TO_WEEKDAY[now.getDay()];
}

// 어르신이 복용 확인(POST /api/pill/confirm)하면 백엔드(PillLogService.notifyProtectorOfCompletion)가 보호자에게
// 제목 "복약 완료", 내용 "{어르신 이름} 님 [아침약|점심약|저녁약] 복용이 확인되었습니다." 알림 기록을 남김.
// 보호자용 "어르신 오늘 복약 상태" 조회 API가 없어서 이 알림 문구를 파싱해 오늘 복용한 시간대를 알아냄
// — 백엔드가 알림 문구를 바꾸면 여기도 같이 바꿔야 함.
const PILL_CONFIRM_TITLE = '복약 완료';
const PILL_CONFIRM_PATTERN = /^(.+) 님 \[(아침약|점심약|저녁약)\] 복용이 확인되었습니다\.?$/;
const PILL_LABEL_TO_MEAL_TYPE: Record<string, MealType> = { 아침약: 'morning', 점심약: 'lunch', 저녁약: 'dinner' };

// 시간대별로 오늘 복용 확인된 횟수를 셈 — 같은 시간대 스케줄이 여러 개면 알림도 어르신 쪽 복약 기록마다 따로 옴
export function countTakenMealTypesFromNotifications(
  notifications: { title: string; content: string; createdAt: string }[],
  wardName: string,
  dateKey: string,
): Record<MealType, number> {
  const counts: Record<MealType, number> = { morning: 0, lunch: 0, dinner: 0 };
  notifications.forEach(({ title, content, createdAt }) => {
    // createdAt은 서버 UTC라 문자열 앞부분을 그대로 비교하면 한국 시각 오전 9시 전 알림이 전날로 잡힘 — 기기 시간대 날짜로 바꿔 비교
    if (title !== PILL_CONFIRM_TITLE || getLocalDateKey(new Date(createdAt)) !== dateKey) return;
    const match = PILL_CONFIRM_PATTERN.exec(content.trim());
    if (match && match[1] === wardName) {
      counts[PILL_LABEL_TO_MEAL_TYPE[match[2]]] += 1;
    }
  });
  return counts;
}
