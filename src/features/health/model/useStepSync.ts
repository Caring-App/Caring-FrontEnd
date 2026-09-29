import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { recordStepsApi } from '../api/stepRecordApi';
import { prepareStepsAccess, readTodaySteps } from '../utils/healthConnect';

// 앱이 켜져 있는 동안 걸음 수를 다시 보내는 간격 — 서버는 "오늘 누적 걸음 수"를 덮어써서 여러 번 보내도 안전함
const SYNC_INTERVAL_MS = 10 * 60 * 1000;

// 어르신 홈이 열려 있는 동안 Health Connect에서 오늘 누적 걸음 수를 읽어 서버(POST /api/step-record)로 보냄
// → 보호자 하루 요약 레포트·걸음 수 그래프에 쓰임. 화면 진입 시, 앱으로 돌아올 때, 켜져 있는 동안 10분마다 보냄.
// Health Connect가 없거나 권한을 거부하면 건너뜀 — 권한은 앱 실행당 한 번만 물어봄
export function useStepSync() {
  const permissionAskedRef = useRef(false);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const sync = async () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      try {
        const status = await prepareStepsAccess(!permissionAskedRef.current);
        permissionAskedRef.current = true;
        if (status !== 'granted') return;
        await recordStepsApi(await readTodaySteps());
      } catch (error) {
        // 레포트 시각(마감) 이후엔 서버가 400을 주는 게 정상이라 경고로만 남김
        console.warn('[useStepSync] 걸음 수 동기화 실패', error instanceof Error ? error.message : error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    sync();
    const timer = setInterval(sync, SYNC_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') sync();
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, []);
}
