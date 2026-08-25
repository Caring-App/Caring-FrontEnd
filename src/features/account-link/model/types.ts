// 보호자 목록에 뜨는 연동 요약 정보 (GET /api/connection)
export interface ConnectionSummary {
  connectionId: number;
  wardId: number;
  wardName: string;
  nickname: string;
  linkedAt: string;
}

// 돌봄대상자가 연동 코드로 보호자와 연동할 때 (POST /api/connection)
export interface LinkConnectionRequest {
  protectorCode: string;
}

export interface LinkConnectionResponse {
  connectionId: number;
  wardName: string;
  // TODO: 백엔드에 응답에 추가해달라고 요청한 필드 — 배포 전까지는 undefined로 내려올 수 있음
  protectorName?: string;
  linkedAt: string;
}

// 연동된 돌봄대상자 상세 정보 (GET /api/connection/{wardId})
export interface ConnectionDetail {
  connectionId: number;
  wardId: number;
  wardName: string;
  nickname: string;
  phone: string;
  birthDate: string;
  address: string;
  diseases: string[];
  linkedAt: string;
}

// 돌봄대상자 정보 수정 (PATCH /api/connection/{wardId})
export interface UpdateConnectionRequest {
  nickname: string;
  name: string;
  phone: string;
  address: string;
}
