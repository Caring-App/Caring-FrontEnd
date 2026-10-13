// 백엔드 인증 API 계약과 동일한 값 사용 (src/features/auth/api/authApi.ts 참고)
export type UserRole = 'PROTECTOR' | 'WARD';

// 회원 권한 등급 — ADMIN만 문의 답변 등록 등 관리자 기능 사용 가능
export type AuthLevel = 'ADMIN' | 'USER';

// GET /api/member/me 응답 — 로그인한 회원 본인 정보.
// 주소가 없는 회원은 baseAddress·detailAddress가 null로 옴. pushEnabled는 서버 기본값이 켜짐(true)
export interface MemberMe {
  name: string;
  phone: string;
  baseAddress: string | null;
  detailAddress: string | null;
  pushEnabled: boolean;
  role: UserRole;
}
