export interface ProfileInfo {
  name: string;
  phone: string;
  address: string;
}

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
// 서버가 address를 항상 그대로 덮어써서(null이면 주소가 지워짐) 매번 채워 보내야 함.
// 비밀번호는 newPassword가 비어 있으면 서버가 변경하지 않음
export interface MyPageUpdateRequest {
  address: string;
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
