import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 연동된 어르신이 없을 때 화면에 뜨는
// MOCK_WARDS의 id(예: 'mother')를 그대로 mock 위치 데이터의 키로 써야 해서 의도적으로 참조함
// (순환참조 없음, ward-management는 location을 참조하지 않음).
import { MOCK_WARDS } from '@features/ward-management/model';
import { useWardLocationStore } from './useWardLocationStore';

type LatLng = { latitude: number; longitude: number };

// TODO: 백엔드 연동 전 mock 데이터. 연동된 어르신이 아직 한 명도 없으면(신규 가입 직후 등)
// useSelectedWardStore가 MOCK_WARDS를 그대로 쓰고 있어(selectedWardId가 'mother' 같은 비-숫자
// 문자열) 실제 wardId로 위치를 조회할 수 없음 — 이 상태에서도 보호자 홈 온보딩 투어가 "위치 GPS"
// 카드를 하이라이트하는 스텝이 있어서, 지도를 아예 못 띄우고 로딩 스피너만 무한히 보이면 투어가
// 깨짐. health/medication 도메인도 같은 이유로 MOCK_WARDS 키의 데모 값을 유지하고 있음.
const MOCK_WARD_LOCATIONS: Record<string, LatLng> = {
  [MOCK_WARDS[0].id]: { latitude: 37.5665, longitude: 126.978 }, // 서울시청
  [MOCK_WARDS[1].id]: { latitude: 37.4979, longitude: 127.0276 }, // 강남역
};

// wardId(string) 기준으로 최신 위치를 구독하고, 필요하면 자동으로 조회함.
// 홈 화면 카드(LocationSection)와 지도 상세 화면(MapScreen)이 같은 로직을 그대로 중복하고 있어서
// 공용 훅으로 뺌 — 스토어의 in-flight 가드 덕분에 두 화면이 동시에 마운트돼도 중복 요청은 안 나감.
//
// 어르신 기기는 5분 간격으로 위치를 새로 보고하므로(locationReportingTask), 마운트 시 한 번만 조회하면
// 화면에 계속 머무는 동안 위치가 갱신되지 않고 정체됨 — useFocusEffect로 이 화면(또는 이 카드가 속한
// 화면)이 포커스될 때마다 다시 조회해서 최소한 재방문 시엔 최신 값을 보여주도록 함.
export function useWardLocation(wardId: string): LatLng | undefined {
  const wardIdNumber = Number(wardId);
  const location = useWardLocationStore(state => state.locationsByWard[wardIdNumber]);
  const fetchLocation = useWardLocationStore(state => state.fetchLocation);

  useFocusEffect(
    useCallback(() => {
      if (!Number.isNaN(wardIdNumber)) {
        fetchLocation(wardIdNumber);
      }
    }, [wardIdNumber, fetchLocation]),
  );

  if (location) return location;
  if (Number.isNaN(wardIdNumber)) return MOCK_WARD_LOCATIONS[wardId];
  return undefined;
}
