import { createSound } from 'react-native-nitro-sound';

// 음성이 끝나지 않아도 이 시간이 지나면 재생을 끝낸 것으로 봄 — 백그라운드 처리 함수나 재생 중 표시가 무한정 붙잡혀 있지 않게
const MAX_PLAY_MS = 60_000;

// ended: 끝까지 재생(또는 최대 시간 경과) / stopped: 다른 음성이 시작되거나 stopVoice로 멈춤 / failed: 재생 실패
export type VoicePlayResult = 'ended' | 'stopped' | 'failed';

// 앱의 안내 음성(어르신 알림 음성, 일정 다시 듣기)은 한 번에 하나만 — 새 음성을 틀면 재생 중이던 음성은 멈춤.
// 알림(notification)과 일정(schedule)이 같이 써서 shared에 둠
const sound = createSound();
let finishCurrent: ((result: VoicePlayResult) => void) | null = null;

// 음성 파일 주소를 재생하고, 재생이 끝나거나 멈추거나 실패하면 그 결과로 resolve
export async function playVoice(url: string): Promise<VoicePlayResult> {
  finishCurrent?.('stopped');
  await sound.stopPlayer().catch(() => {});

  return new Promise<VoicePlayResult>(resolve => {
    const timer = setTimeout(() => finish('ended'), MAX_PLAY_MS);
    function finish(result: VoicePlayResult) {
      clearTimeout(timer);
      sound.removePlaybackEndListener();
      if (finishCurrent === finish) finishCurrent = null;
      resolve(result);
    }
    finishCurrent = finish;
    sound.addPlaybackEndListener(() => finish('ended'));
    sound.startPlayer(url).catch(error => {
      console.log('[음성 재생] 실패:', error instanceof Error ? error.message : error);
      finish('failed');
    });
  });
}

// 재생 중인 음성을 멈춤(재생 중이 아니면 아무 일도 안 함)
export async function stopVoice() {
  finishCurrent?.('stopped');
  await sound.stopPlayer().catch(() => {});
}
