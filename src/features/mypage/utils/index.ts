// 기본 주소 + 상세 주소를 하나의 주소 문자열로 — 회원가입 때 서버가 저장하는 형식(combineAddress)과 동일하게 맞춤
export function combineAddress(baseAddress: string, detailAddress: string): string {
  const detail = detailAddress.trim();
  return detail ? `${baseAddress} ${detail}` : baseAddress;
}
