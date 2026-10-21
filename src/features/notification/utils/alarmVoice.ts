import { playVoice } from '@shared/utils/voicePlayer';
import type { PushAlarmData } from '../model/types';

// 어르신 알림(복약·재알림·일정)의 음성 파일을 재생하고, 재생이 끝나면 resolve.
// 앱이 꺼져 있을 때도 백그라운드 처리 함수(index.js)에서 불리는데, 그 함수가 끝나면 앱이 다시 종료될 수 있어서
// 재생이 끝날 때까지 기다렸다가 끝나야 함. 음성 파일이 없거나 재생에 실패하면 바로 끝냄(시스템 알림은 그대로 뜸)
export async function playAlarmVoice(data: PushAlarmData | undefined): Promise<void> {
  const url = data?.voiceFileUrl;
  if (!url) return;
  await playVoice(url);
}
