// 기본 주소 + 상세 주소를 하나의 주소 문자열로 — 백엔드 combineAddress와 같은 규칙(상세 주소가 있으면 공백으로 이어 붙임).
// 서버가 조합해 주는 값을 화면에 먼저 반영해야 할 때만 사용
export function combineAddress(baseAddress: string, detailAddress: string) {
  return detailAddress.trim() ? `${baseAddress} ${detailAddress.trim()}` : baseAddress;
}
