import { useEffect } from 'react';
import { MOCK_WELFARE_FACILITIES } from './mockFacilities';
import { WelfareFacility } from './types';
import { useWelfareFacilityStore } from './useWelfareFacilityStore';

interface NearbyWelfareFacilities {
  // 아직 한 번도 조회 결과를 받지 못했으면 undefined(로딩/에러 화면과 "시설 없음"을 구분하기 위함)
  facilities: WelfareFacility[] | undefined;
  isLoading: boolean;
  errorMessage: string | undefined;
  refetch: () => void;
}

// wardId(string) 기준으로 어르신 주변 공공 복지 시설을 구독하고, 아직 조회한 적 없으면 자동으로 조회함.
// 등록 주소 기준이라 자주 바뀌지 않고, 백엔드 첫 조회가 느려서(공공데이터 API 호출) useWardLocation처럼
// 포커스될 때마다 재조회하지 않고 어르신별로 한 번만 불러옴 — 실패했을 때만 refetch로 다시 시도.
export function useNearbyWelfareFacilities(wardId: string): NearbyWelfareFacilities {
  const wardIdNumber = Number(wardId);
  const isMockWard = Number.isNaN(wardIdNumber);
  const facilities = useWelfareFacilityStore(state => state.facilitiesByWard[wardIdNumber]);
  const isLoading = useWelfareFacilityStore(state => state.loadingWardIds.has(wardIdNumber));
  const errorMessage = useWelfareFacilityStore(state => state.errorByWard[wardIdNumber]);
  const fetchFacilities = useWelfareFacilityStore(state => state.fetchFacilities);
  const hasFetched = facilities !== undefined;

  useEffect(() => {
    if (!isMockWard && !hasFetched) {
      fetchFacilities(wardIdNumber);
    }
  }, [isMockWard, hasFetched, wardIdNumber, fetchFacilities]);

  // 연동된 어르신이 없으면(mock id) 실제 조회를 할 수 없어서 데모 데이터를 보여줌(MOCK_WELFARE_FACILITIES 참고)
  if (isMockWard) {
    return { facilities: MOCK_WELFARE_FACILITIES, isLoading: false, errorMessage: undefined, refetch: () => {} };
  }
  return { facilities, isLoading, errorMessage, refetch: () => fetchFacilities(wardIdNumber) };
}
