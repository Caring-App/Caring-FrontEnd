import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 연동된 어르신이 아직 없을 때 화면에 뜨는
// MOCK_WARDS의 id를 그대로 mock 상태 데이터의 키로 써야 해서 의도적으로 참조함(location/medication
// 도메인과 같은 이유, 순환참조 없음).
import { MOCK_WARDS } from '@features/ward-management/model';
import { useHealthStatusStore } from './useHealthStatusStore';
import type { HealthStatus } from './useHealthStatusStore';

// TODO: 백엔드 연동 전 mock 데이터, 연동된 어르신이 아직 한 명도 없으면(selectedWardId가 'mother' 같은
// 비-숫자 문자열) 실제 wardId로 조회할 수 없음 — 온보딩 투어가 이 카드를 하이라이트하는 스텝이 있어서
// 이 상태에서도 값을 보여줘야 함(useWardLocation과 같은 이유).
const MOCK_STATUS_BY_WARD: Record<string, HealthStatus> = {
  [MOCK_WARDS[0].id]: 'good',
  [MOCK_WARDS[1].id]: 'normal',
};

// wardId(string) 기준으로 오늘의 건강 상태를 구독하고, 필요하면 자동으로 조회함.
// 어르신이 하루 중 언제든 상태를 새로 기록할 수 있어(WardHealthStatusCard), useWardLocation과 같은
// 이유로 포커스될 때마다 재조회함.
export function useWardMoodStatus(wardId: string): HealthStatus | undefined {
  const wardIdNumber = Number(wardId);
  const status = useHealthStatusStore(state => state.statusByWard[wardIdNumber]);
  const fetchStatus = useHealthStatusStore(state => state.fetchStatus);

  useFocusEffect(
    useCallback(() => {
      if (!Number.isNaN(wardIdNumber)) {
        fetchStatus(wardIdNumber);
      }
    }, [wardIdNumber, fetchStatus]),
  );

  if (status) return status;
  if (Number.isNaN(wardIdNumber)) return MOCK_STATUS_BY_WARD[wardId];
  return undefined;
}
