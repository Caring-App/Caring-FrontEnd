import { WelfareFacility } from './types';

// 연동된 어르신이 아직 한 명도 없으면(신규 가입 직후 등) selectedWardId가 'mother' 같은 mock id라
// 실제 API로 조회할 수 없음 — 이때 목록 화면이 비어 보이지 않도록 보여주는 데모 데이터
// (location/health 도메인의 MOCK_WARDS 폴백과 같은 패턴, useNearbyWelfareFacilities 참고).
export const MOCK_WELFARE_FACILITIES: WelfareFacility[] = [
  {
    id: 'mock-1',
    name: '구로 어르신 돌봄 통합 센터',
    address: '서울특별시 구로구 구로동 123-45',
    phone: '02-2620-1234',
    operator: '구로구청',
    homepage: null,
    distanceKm: 0.35,
  },
  {
    id: 'mock-2',
    name: '구로구 치매안심센터 (고척분소)',
    address: '서울특별시 구로구 경인로20가길 5 5층',
    phone: '02-6952-7056',
    operator: '구로구보건소',
    homepage: null,
    distanceKm: 0.8,
  },
  {
    id: 'mock-3',
    name: '고척 근린공원 내 경로당',
    address: '서울특별시 구로구 고척로 63',
    phone: '02-2610-8090',
    operator: null,
    homepage: null,
    distanceKm: 1.24,
  },
];
