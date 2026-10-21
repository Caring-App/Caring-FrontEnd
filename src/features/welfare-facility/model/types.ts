// GET /api/welfare-facility 응답 항목. 필드명은 백엔드가 그대로 넘겨주는 공공데이터(사회복지시설 정보) 원본 키.
// 공공데이터에 값이 비어있는 시설이 있어서 문자열 필드는 전부 null일 수 있음(백엔드 toStringOrNull 참고).
export interface WelfareFacilityResponse {
  fcltNm: string;
  address: string | null;
  telNo: string | null;
  // 운영 법인명
  cprNm: string | null;
  homepageAddr: string | null;
  // 어르신 등록 주소 좌표 기준 직선거리(km, 소수 둘째 자리 반올림)
  distanceKm: number;
}

// 화면에서 쓰는 형태. 응답에 시설 고유 id가 없어서 id는 이름+주소로 만든 파생 키(리스트 key 전용).
export interface WelfareFacility {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  operator: string | null;
  homepage: string | null;
  distanceKm: number;
}
