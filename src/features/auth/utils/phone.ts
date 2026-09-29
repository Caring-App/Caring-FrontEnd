// 전화번호는 상태·전송 모두 숫자만 쓰고(백엔드 예시도 01012345678 형태), 화면에서만 하이픈을 붙여 보여줌

// 입력값에서 숫자만 남기고 최대 11자리로 자름 — 하이픈이 섞인 입력(자동 포맷 결과)을 다시 받을 때 사용
export const normalizePhoneDigits = (value: string) => value.replace(/\D/g, '').slice(0, 11);

// 010-0000-0000 형태로 표시 (10자리 번호는 010-000-0000)
export const formatPhoneNumber = (digits: string) => {
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

// 하이픈 포함 표시 길이(010-0000-0000) — TextInput maxLength용
export const FORMATTED_PHONE_MAX_LENGTH = 13;

export const isValidPhoneNumber = (digits: string) => /^01\d{8,9}$/.test(digits);
