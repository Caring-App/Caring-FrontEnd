import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { logApiError } from '@shared/api';
import { getMyConnectionApi } from '../api';

// unknown: 아직 조회 전이거나 조회 실패
export type WardLinkStatus = 'unknown' | 'linked' | 'unlinked';

// 어르신 홈에서 보호자와 연동됐는지 확인 — 연동 안 됐으면 메인 화면 대신 연동 안내를 보여주기 위함.
// 화면 포커스·앱 복귀 때마다 다시 조회함(보호자가 연동을 끊었을 수도 있어서).
// 조회가 실패하면 연동된 어르신을 막지 않도록 메인 화면을 그대로 보여줌(unknown) — 백엔드에
// /api/connection/me가 생기기 전까지는 항상 실패해서 지금 동작과 같음. 그래서 실패 안내도 띄우지 않음
export function useWardLinkStatus() {
  const [status, setStatus] = useState<WardLinkStatus>('unknown');

  const refresh = useCallback(async () => {
    try {
      const { connected } = await getMyConnectionApi();
      setStatus(connected ? 'linked' : 'unlinked');
    } catch (error) {
      logApiError('어르신 연동 상태 조회 실패', error);
      setStatus('unknown');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  // 연동 코드 입력에 성공하면 다시 조회하지 않고 바로 메인 화면으로
  const markLinked = useCallback(() => setStatus('linked'), []);

  return { status, markLinked };
}
