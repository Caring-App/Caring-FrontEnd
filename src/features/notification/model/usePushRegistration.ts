import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { getMessaging, getToken, onMessage, onTokenRefresh } from '@react-native-firebase/messaging';
import { logApiError, updateFcmTokenApi } from '@shared/api';
import { showNotice } from '@shared/model';
import { useSessionStore } from '@shared/store/useSessionStore';
import { playAlarmVoice } from '../utils';
import type { PushAlarmData } from './types';
import { useNotificationStore } from './useNotificationStore';

// Android 13+(API 33)는 알림 권한을 따로 받아야 시스템 알림이 뜸. 거절해도 토큰 등록·음성 재생은 그대로 함
async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
}

async function registerToken(token: string) {
  try {
    await updateFcmTokenApi(token);
  } catch (error) {
    logApiError('FCM 토큰 등록 실패', error);
  }
}

// 로그인해 있는 동안 이 기기의 FCM 토큰을 서버에 등록하고, 앱이 켜져 있을 때 온 알림을 처리함.
// 앱이 켜져 있으면 시스템 알림이 뜨지 않아서 공용 안내 창으로 보여줌 — 백그라운드·종료 상태는 index.js의 처리 함수가 맡음.
// (로그아웃 시 토큰 삭제는 confirmLogout — 로그아웃 후엔 인증 토큰이 없어 여기서 지울 수 없음)
export function usePushRegistration(isLoggedIn: boolean) {
  useEffect(() => {
    if (!isLoggedIn) return;
    const messaging = getMessaging();

    requestNotificationPermission()
      .then(() => getToken(messaging))
      .then(registerToken)
      .catch(error => console.log('FCM 토큰 발급 실패:', error instanceof Error ? error.message : error));

    const unsubscribeTokenRefresh = onTokenRefresh(messaging, registerToken);
    const unsubscribeMessage = onMessage(messaging, async message => {
      const { title, body } = message.notification ?? {};
      if (title) showNotice(title, body);
      if (useSessionStore.getState().role === 'PROTECTOR') {
        // 보호자 홈의 복약 상태가 알림 목록으로 계산돼서 새 알림이 오면 바로 다시 받아옴
        useNotificationStore.getState().fetchNotifications();
      } else {
        await playAlarmVoice(message.data as PushAlarmData | undefined);
      }
    });

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeMessage();
    };
  }, [isLoggedIn]);
}
