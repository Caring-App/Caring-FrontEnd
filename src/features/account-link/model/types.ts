// 백엔드 fontSize enum(대문자) — ward-management 로컬 FontSizeOption('small'|'medium'|'large')과 매핑 필요
export type ConnectionFontSize = 'SMALL' | 'MEDIUM' | 'LARGE';

// 보호자 목록에 뜨는 연동 요약 정보 (GET /api/connection)
export interface ConnectionSummary {
  connectionId: number;
  wardId: number;
  wardName: string;
  nickname: string;
  linkedAt: string;
  // 어르신의 ward-setting 레코드가 아직 없으면 fontSize/ttsRate 둘 다 null로 내려옴(실기기 확인함, 2026-08-26)
  fontSize: ConnectionFontSize | null;
  ttsRate: number | null;
}

// 돌봄대상자가 연동 코드로 보호자와 연동할 때 (POST /api/connection)
export interface LinkConnectionRequest {
  protectorCode: string;
}

export interface LinkConnectionResponse {
  connectionId: number;
  protectorName: string;
  wardName: string;
  linkedAt: string;
}

// 연동된 돌봄대상자 상세 정보 (GET /api/connection/{wardId})
// connectionId/birthDate/diseases/linkedAt는 이전엔 있었으나 백엔드가 응답에서 제거함
export interface ConnectionDetail {
  wardId: number;
  wardName: string;
  nickname: string;
  phone: string;
  address: string;
}

// 돌봄대상자 정보 수정 (PATCH /api/connection/{wardId})
export interface UpdateConnectionRequest {
  nickname: string;
  name: string;
  phone: string;
  address: string;
}
