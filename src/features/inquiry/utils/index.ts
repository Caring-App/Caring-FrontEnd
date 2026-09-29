// 서버 LocalDateTime 문자열('2026-09-30T14:05:12') → 'YYYY.MM.DD HH:mm'.
// 시간대 정보가 없는 문자열이라 Date로 바꾸지 않고 글자 그대로 잘라 써서 기기 시간대 영향을 받지 않게 함
export function formatInquiryDateTime(dateTime: string): string {
  const [date = '', time = ''] = dateTime.split('T');
  return `${date.replace(/-/g, '.')} ${time.slice(0, 5)}`.trim();
}

// 목록용 'YYYY.MM.DD'
export function formatInquiryDate(dateTime: string): string {
  return (dateTime.split('T')[0] ?? '').replace(/-/g, '.');
}
