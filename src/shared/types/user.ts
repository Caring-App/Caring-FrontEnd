// 백엔드 인증 API 계약과 동일한 값 사용 (src/features/auth/api/authApi.ts 참고)
export type UserRole = 'PROTECTOR' | 'WARD';

// 회원 권한 등급 — ADMIN만 문의 답변 등록 등 관리자 기능 사용 가능
export type AuthLevel = 'ADMIN' | 'USER';
