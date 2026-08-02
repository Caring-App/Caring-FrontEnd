import { MOCK_WARDS } from '@features/ward-management/model';

export interface WardLocation {
  latitude: number;
  longitude: number;
}

// TODO: 실제 서비스에서는 features/location API로 돌봄대상자 기기의 실시간 좌표를 받아와야 함.
// 백엔드 연동 전까지는 어르신별 임시 좌표로 지도 렌더링만 검증.
const MOCK_WARD_LOCATIONS: Record<string, WardLocation> = {
  [MOCK_WARDS[0].id]: { latitude: 37.5665, longitude: 126.978 }, // 서울시청
  [MOCK_WARDS[1].id]: { latitude: 37.4979, longitude: 127.0276 }, // 강남역
};

const DEFAULT_WARD_LOCATION: WardLocation = MOCK_WARD_LOCATIONS[MOCK_WARDS[0].id];

export function getWardLocation(wardId: string): WardLocation {
  return MOCK_WARD_LOCATIONS[wardId] ?? DEFAULT_WARD_LOCATION;
}
