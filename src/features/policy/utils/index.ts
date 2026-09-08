// 정책 상세의 updatedAt(ISO 8601)을 'YYYY.MM.DD' 형태로 표시하기 위한 포맷터.
// updatedAt이 비어있거나 파싱 불가능한 값이면 'Invalid Date'가 되어 NaN.NaN.NaN으로 노출될 수 있어 방어함.
export function formatPolicyUpdatedAt(updatedAt: string): string {
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return '';

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}
