import BackgroundService, { BackgroundTaskOptions } from 'react-native-background-actions';
import Geolocation from '@react-native-community/geolocation';
import { logApiError } from '@shared/api';
import { colors } from '@shared/theme/colors';
import { reportWardLocationApi } from '../api';

// 얼마나 자주 위치를 보고할지 — 너무 짧으면 배터리 소모가 커지고, 너무 길면 보호자 화면이 실시간성이 떨어짐.
const REPORT_INTERVAL_MS = 5 * 60 * 1000;
// stop()이 호출된 뒤 최대 이 시간 안에는 루프가 멈춰야 함. react-native-background-actions의 stop()은
// isRunning()만 false로 바꿀 뿐, 이미 시작된 대기(sleep)를 중간에 깨우지 못함 — REPORT_INTERVAL_MS를
// 통으로 기다리면 로그아웃 후에도 최대 5분간 위치를 계속 보고하고, 그 사이 다른 계정이 로그인해 새
// 리포팅 루프를 또 띄우면 두 루프가 동시에 도는 상태가 될 수 있어 짧은 간격으로 쪼개서 확인함.
const STOP_CHECK_INTERVAL_MS = 5 * 1000;

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

async function waitWhileRunning(totalMs: number) {
  let waited = 0;
  while (waited < totalMs && BackgroundService.isRunning()) {
    await sleep(Math.min(STOP_CHECK_INTERVAL_MS, totalMs - waited));
    waited += STOP_CHECK_INTERVAL_MS;
  }
}

function getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      error => reject(error),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 },
    );
  });
}

// BackgroundService.start()에 넘겨지는 태스크 — Android에서 포그라운드 서비스(알림 표시)로 계속 실행되며,
// BackgroundService.stop()이 호출되어 isRunning()이 false가 될 때까지 반복함.
const reportLocationTask = async () => {
  while (BackgroundService.isRunning()) {
    try {
      const { latitude, longitude } = await getCurrentPosition();
      await reportWardLocationApi(latitude, longitude);
    } catch (error) {
      logApiError('어르신 위치 보고 실패', error);
    }
    await waitWhileRunning(REPORT_INTERVAL_MS);
  }
};

const options: BackgroundTaskOptions = {
  taskName: '케어링 위치 공유',
  taskTitle: '위치 공유 중',
  taskDesc: '보호자에게 위치를 전달하고 있어요',
  taskIcon: { name: 'ic_launcher', type: 'mipmap' },
  color: colors.primary,
  // AndroidManifest.xml의 <service foregroundServiceType="location">과 반드시 일치해야 함.
  foregroundServiceType: ['location'],
};

export async function startWardLocationReporting() {
  if (BackgroundService.isRunning()) return;
  await BackgroundService.start(reportLocationTask, options);
}

export async function stopWardLocationReporting() {
  if (!BackgroundService.isRunning()) return;
  await BackgroundService.stop();
}
