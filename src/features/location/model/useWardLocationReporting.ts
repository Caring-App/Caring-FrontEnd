import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { startWardLocationReporting, stopWardLocationReporting } from './locationReportingTask';

// Android 6+(API 23)는 위치 권한을, Android 13+(API 33)는 알림 권한(포그라운드 서비스 알림 표시용)을
// 런타임에 따로 요청해야 함 — 안 하면 위치 조회가 조용히 실패하거나 알림이 안 뜸.
async function requestPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;

  const fineLocation = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  if (fineLocation !== PermissionsAndroid.RESULTS.GRANTED) {
    return false;
  }
  if (Number(Platform.Version) >= 33) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
  return true;
}

// 어르신(WARD)으로 로그인해있는 동안 위치 권한을 요청하고, 백그라운드에서도 주기적으로 위치를 서버에
// 보고하는 포그라운드 서비스를 켜고 끔. 이 훅을 부르는 컴포넌트가 곧 "WARD 로그인 상태"의 생명주기와
// 같아야 함(SeniorStackNavigator가 role===WARD && isLoggedIn일 때만 마운트되므로 거기서 호출).
export function useWardLocationReporting() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const granted = await requestPermissions();
      if (!cancelled && granted) {
        startWardLocationReporting();
      }
    })();

    return () => {
      cancelled = true;
      stopWardLocationReporting();
    };
  }, []);
}
