import { useEffect } from 'react';
import { useWardLocationStore } from './useWardLocationStore';

// wardId(string) 기준으로 최신 위치를 구독하고, 필요하면 자동으로 조회함.
// 홈 화면 카드(LocationSection)와 지도 상세 화면(MapScreen)이 같은 로직을 그대로 중복하고 있어서
// 공용 훅으로 뺌 — 스토어의 in-flight 가드 덕분에 두 화면이 동시에 마운트돼도 중복 요청은 안 나감.
export function useWardLocation(wardId: string) {
  const wardIdNumber = Number(wardId);
  const location = useWardLocationStore(state => state.locationsByWard[wardIdNumber]);
  const fetchLocation = useWardLocationStore(state => state.fetchLocation);

  useEffect(() => {
    if (!Number.isNaN(wardIdNumber)) {
      fetchLocation(wardIdNumber);
    }
  }, [wardIdNumber, fetchLocation]);

  return location;
}
