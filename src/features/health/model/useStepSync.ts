import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import {
  aggregateRecord,
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import { recordStepsApi } from '../api/stepRecordApi';

// 앱이 켜져 있는 동안 걸음 수를 다시 보내는 간격 — 서버는 "오늘 누적 걸음 수"를 덮어써서 여러 번 보내도 안전함
const SYNC_INTERVAL_MS = 10 * 60 * 1000;

const STEPS_READ_PERMISSION = { accessType: 'read', recordType: 'Steps' } as const;

async function readTodaySteps(): Promise<number> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const result = await aggregateRecord({
    recordType: 'Steps',
    timeRangeFilter: { operator: 'between', startTime: startOfToday.toISOString(), endTime: now.toISOString() },
  });
  return result.COUNT_TOTAL ?? 0;
}

async function hasStepsPermission() {
  const granted = await getGrantedPermissions();
  return granted.some(
    permission => permission.recordType === 'Steps' && permission.accessType === STEPS_READ_PERMISSION.accessType,
  );
}

// 어르신 홈이 열려 있는 동안 Health Connect(삼성 헬스·구글 핏 등이 기록한 걸음 수)에서 오늘 누적 걸음 수를 읽어
// 서버(POST /api/step-record)로 보냄 → 보호자 하루 요약 레포트·걸음 수 그래프에 쓰임.
// 화면 진입 시, 앱으로 돌아올 때, 켜져 있는 동안 10분마다 보냄. Android 전용.
// Health Connect가 없거나(Android 13 이하에서 미설치) 권한을 거부하면 조용히 건너뜀 — 권한은 앱 실행당 한 번만 물어봄
export function useStepSync() {
  const permissionAskedRef = useRef(false);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const sync = async () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      try {
        if ((await getSdkStatus()) !== SdkAvailabilityStatus.SDK_AVAILABLE) return;
        if (!(await initialize())) return;

        if (!(await hasStepsPermission())) {
          if (permissionAskedRef.current) return;
          permissionAskedRef.current = true;
          await requestPermission([STEPS_READ_PERMISSION]);
          if (!(await hasStepsPermission())) return;
        }

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
