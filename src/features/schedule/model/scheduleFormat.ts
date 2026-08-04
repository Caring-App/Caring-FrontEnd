import { ScheduleEntry, TimeState } from './scheduleRegistrationTypes';

export function to24Hour(time: TimeState): { hour: number; minute: number } {
  let hour = Number(time.hour) % 12;
  if (time.amPm === 'PM') {
    hour += 12;
  }
  return { hour, minute: Number(time.minute) };
}

export function formatScheduleDateTime(entry: ScheduleEntry): string {
  const { hour, minute } = to24Hour(entry.scheduleTime);
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `${entry.date.getFullYear()}년 ${entry.date.getMonth() + 1}월 ${entry.date.getDate()}일 ${hh}:${mm}`;
}

export function formatScheduleDateTimeShort(entry: ScheduleEntry): string {
  const { hour, minute } = to24Hour(entry.scheduleTime);
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `${entry.date.getMonth() + 1}월 ${entry.date.getDate()}일 ${hh}:${mm}`;
}
