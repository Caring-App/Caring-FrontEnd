export function formatTime(hour: number, minute: number): string {
  const paddedHour = String(hour).padStart(2, '0');
  const paddedMinute = String(minute).padStart(2, '0');
  return `${paddedHour}:${paddedMinute}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// 기기 로컬 날짜 'YYYY-MM-DD' — "오늘" 판별이나 서버 LocalDateTime 문자열의 날짜 부분과 비교하는 용도
export function getLocalDateKey(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
