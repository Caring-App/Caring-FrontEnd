// 알림 목록의 createdAt(ISO 8601, 서버 UTC)을 'YYYY.MM.DD HH:mm' 형태로 표시하기 위한 포맷터.
export function formatNotificationDate(createdAt: string): string {
  const date = new Date(createdAt);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}
