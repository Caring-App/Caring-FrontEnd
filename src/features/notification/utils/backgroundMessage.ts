import type { RemoteMessage } from '@react-native-firebase/messaging';
import type { PushAlarmData } from '../model/types';
import { playAlarmVoice } from './alarmVoice';

// 앱이 백그라운드거나 꺼져 있을 때 온 FCM 메시지 처리(index.js에서 등록). 시스템 알림은 Android가 직접 띄우고,
// 여기선 어르신 알림의 음성만 재생함 — React 화면 밖에서 실행돼서 스토어·안내 창은 쓰지 않음
export async function handleBackgroundMessage(message: RemoteMessage) {
  await playAlarmVoice(message.data as PushAlarmData | undefined);
}
