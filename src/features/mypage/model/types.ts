export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface WithdrawReasonOption {
  id: string;
  label: string;
}

// PATCH /api/member 요청 (member-controller, 마이페이지 개인 정보 수정).
// 주소는 회원가입처럼 기본 주소·상세 주소를 나눠 보냄 — baseAddress를 빼면 서버가 기존 주소를 그대로 둠
// (빈 문자열은 그 값으로 덮어써지므로 주소를 안 바꿀 땐 필드 자체를 빼야 함).
// 비밀번호는 newPassword가 비어 있으면 서버가 변경하지 않음
export interface MyPageUpdateRequest {
  baseAddress?: string;
  detailAddress?: string;
  currentPassword?: string;
  newPassword?: string;
  newPasswordCheck?: string;
}

// PATCH /api/member/phone 요청 — newPhone으로 SMS 인증(/api/auth/sms/verify)을 마친 뒤 같은 인증번호를 함께 보냄
export interface PhoneChangeRequest {
  newPhone: string;
  authNumber: string;
}

// GET /api/member/protector-code 응답 — 보호자만 조회 가능(어르신이면 서버 400)
export interface ProtectorCodeResponse {
  protectorCode: string;
}
