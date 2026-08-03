export interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
}

export const WEEKDAY_LABELS_KO = ['일', '월', '화', '수', '목', '금', '토'];

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function getCalendarWeeks(month: Date): CalendarDay[][] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const monthStart = new Date(year, monthIndex, 1);
  const gridStart = new Date(year, monthIndex, 1 - monthStart.getDay());

  const days: CalendarDay[] = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    return { date, inCurrentMonth: date.getMonth() === monthIndex };
  });

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}
