// SMS 인증번호 규칙 — 백엔드 MemberService.sendSms 기준(6자리 숫자, 발송 후 3분 뒤 만료)
export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_SECONDS = 180;

export const normalizeVerificationCode = (value: string) =>
  value.replace(/\D/g, '').slice(0, VERIFICATION_CODE_LENGTH);

// 남은 초를 "2:57" 형태로
export const formatRemainingTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
