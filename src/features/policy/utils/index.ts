// 정책 상세의 updatedAt(ISO 8601)을 'YYYY.MM.DD' 형태로 표시하기 위한 포맷터.
export function formatPolicyUpdatedAt(updatedAt: string): string {
  const date = new Date(updatedAt);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}
