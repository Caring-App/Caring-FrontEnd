// 문의하기 백엔드 DTO (/v3/api-docs의 inquiry-controller 기준)

// POST /api/inquiries 요청 — 보호자만 작성 가능(어르신 계정이면 서버가 400)
export interface InquiryCreateRequest {
  title: string;
  content: string;
}

// GET /api/inquiries/me(목록, 최신순) · GET /api/inquiries/{id}(상세) 응답
export interface Inquiry {
  inquiryId: number;
  title: string;
  content: string;
  // 답변 전엔 null
  answer: string | null;
  createdAt: string;
  answeredAt: string | null;
  answered: boolean;
}

// PATCH /api/inquiries/{id}/answer 요청 — 관리자(authLevel ADMIN)만 가능
export interface InquiryAnswerRequest {
  answer: string;
}

// 입력 길이 제한 — 제목은 DB VARCHAR(255), 내용·답변은 TEXT라 화면에서 읽기 좋은 길이로 제한
export const INQUIRY_TITLE_MAX_LENGTH = 100;
export const INQUIRY_CONTENT_MAX_LENGTH = 2000;
