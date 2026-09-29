import { Platform } from 'react-native';
import {
  aggregateRecord,
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  requestPermission,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';

// 기기의 Health Connect(삼성 헬스·구글 핏 등이 기록한 건강 데이터)에서 걸음 수를 읽는 부분 — 서버 API가 아니라 기기 데이터라 utils에 둠

const STEPS_READ_PERMISSION = { accessType: 'read', recordType: 'Steps' } as const;
// 앱이 화면에 없을 때(위치 공유 백그라운드 서비스)도 걸음 수를 읽기 위한 권한 — 이 기능을 지원하지 않는 기기에서는 무시됨
const BACKGROUND_READ_PERMISSION = { accessType: 'read', recordType: 'BackgroundAccessPermission' } as const;

// 'unavailable': Android가 아니거나 Health Connect가 없음(Android 13 이하 미설치) / 'denied': 걸음 수 권한 없음
export type StepsAccessStatus = 'granted' | 'denied' | 'unavailable';

async function hasStepsPermission() {
  const granted = await getGrantedPermissions();
  return granted.some(
    permission => permission.recordType === 'Steps' && permission.accessType === STEPS_READ_PERMISSION.accessType,
  );
}

// 걸음 수를 읽을 수 있는지 확인하고, askIfMissing이면 권한이 없을 때 Health Connect 권한 화면을 띄움
export async function prepareStepsAccess(askIfMissing: boolean): Promise<StepsAccessStatus> {
  if (Platform.OS !== 'android') return 'unavailable';
  if ((await getSdkStatus()) !== SdkAvailabilityStatus.SDK_AVAILABLE) return 'unavailable';
  if (!(await initialize())) return 'unavailable';
  if (await hasStepsPermission()) return 'granted';
  if (!askIfMissing) return 'denied';

  await requestPermission([STEPS_READ_PERMISSION, BACKGROUND_READ_PERMISSION]);
  return (await hasStepsPermission()) ? 'granted' : 'denied';
}

// 오늘 0시부터 지금까지의 누적 걸음 수 (여러 앱이 기록한 걸음은 Health Connect가 중복 없이 합산)
export async function readTodaySteps(): Promise<number> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const result = await aggregateRecord({
    recordType: 'Steps',
    timeRangeFilter: { operator: 'between', startTime: startOfToday.toISOString(), endTime: now.toISOString() },
  });
  return result.COUNT_TOTAL ?? 0;
}
