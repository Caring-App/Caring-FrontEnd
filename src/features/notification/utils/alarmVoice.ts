import { createSound } from 'react-native-nitro-sound';
import type { PushAlarmData } from '../model/types';

// 음성이 끝나지 않아도 이 시간이 지나면 재생을 끝낸 것으로 봄 — 백그라운드 처리 함수가 무한정 붙잡혀 있지 않게
const MAX_PLAY_MS = 60_000;

// 알림 음성은 한 번에 하나만 — 새 알림이 오면 재생 중이던 음성은 멈추고 새로 재생
const sound = createSound();
let finishCurrent: (() => void) | null = null;

// 어르신 알림(복약·재알림·일정)의 음성 파일을 재생하고, 재생이 끝나면 resolve.
// 앱이 꺼져 있을 때도 백그라운드 처리 함수(index.js)에서 불리는데, 그 함수가 끝나면 앱이 다시 종료될 수 있어서
// 재생이 끝날 때까지 기다렸다가 끝나야 함. 음성 파일이 없거나 재생에 실패하면 바로 끝냄(시스템 알림은 그대로 뜸)
export async function playAlarmVoice(data: PushAlarmData | undefined): Promise<void> {
  const url = data?.voiceFileUrl;
  if (!url) return;

  finishCurrent?.();
  await sound.stopPlayer().catch(() => {});

  await new Promise<void>(resolve => {
    const timer = setTimeout(() => finish(), MAX_PLAY_MS);
    function finish() {
      clearTimeout(timer);
      sound.removePlaybackEndListener();
      if (finishCurrent === finish) finishCurrent = null;
      resolve();
    }
    finishCurrent = finish;
    sound.addPlaybackEndListener(() => finish());
    sound.startPlayer(url).catch(error => {
      console.log('[알림 음성] 재생 실패:', error instanceof Error ? error.message : error);
      finish();
    });
  });
}
