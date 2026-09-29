import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { openStepsAccessFix, prepareStepsAccess, StepsAccessStatus } from '../utils/healthConnect';
import { syncTodaySteps } from './syncTodaySteps';

// 앱이 켜져 있는 동안 걸음 수를 다시 보내는 간격 — 서버는 "오늘 누적 걸음 수"를 덮어써서 여러 번 보내도 안전함
const SYNC_INTERVAL_MS = 10 * 60 * 1000;

// 어르신 홈이 열려 있는 동안 Health Connect에서 오늘 누적 걸음 수를 읽어 서버(POST /api/step-record)로 보냄
// → 보호자 하루 요약 레포트·걸음 수 그래프에 쓰임. 화면 진입 시, 앱으로 돌아올 때, 켜져 있는 동안 10분마다 보냄.
// (앱이 화면에 없을 때는 위치 공유 백그라운드 서비스가 대신 보냄 — locationReportingTask 참고)
// 권한은 앱 실행당 한 번만 자동으로 물어보고, 못 읽는 상태(status)는 화면에 안내해서 어르신이 직접 해결할 수 있게 함
export function useStepSync() {
  const [status, setStatus] = useState<StepsAccessStatus | null>(null);
  const permissionAskedRef = useRef(false);
  const isSyncingRef = useRef(false);

  const sync = useCallback(async (askIfMissing: boolean) => {
    if (Platform.OS !== 'android' || isSyncingRef.current) return;
    isSyncingRef.current = true;
    try {
      const nextStatus = await prepareStepsAccess(askIfMissing);
      setStatus(nextStatus);
      if (nextStatus === 'granted') await syncTodaySteps();
    } catch (error) {
      console.log('[useStepSync] Health Connect 확인 실패', error instanceof Error ? error.message : error);
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const syncOnce = () => {
      sync(!permissionAskedRef.current);
      permissionAskedRef.current = true;
    };
    syncOnce();
    const timer = setInterval(syncOnce, SYNC_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') syncOnce();
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [sync]);

  // 안내 문구의 버튼 — 권한 화면을 다시 띄워보고, 그래도 안 되면 설정/스토어로 보냄
  const fixAccess = useCallback(async () => {
    if (status === 'denied') {
      await sync(true);
      if ((await prepareStepsAccess(false)) === 'granted') return;
    }
    if (status) openStepsAccessFix(status);
  }, [status, sync]);

  return { status, fixAccess };
}
