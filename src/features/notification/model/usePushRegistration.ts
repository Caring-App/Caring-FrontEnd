import { useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { deleteToken, getMessaging, getToken, onMessage, onTokenRefresh } from '@react-native-firebase/messaging';
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
// 로그아웃되면 이 기기의 토큰을 폐기함 — 로그인 만료로 자동 로그아웃되면 서버에서 토큰을 지울 수 없어(인증 토큰이 무효)
// 서버에 남은 토큰으로 이전 계정 알림이 계속 오고, 이 기기로 다른 계정이 로그인하면 같은 토큰이 두 계정에 등록돼
// 두 계정 알림이 다 옴. 폐기된 토큰으론 알림이 안 가고, 다음 로그인 때 새 토큰을 받아 그 계정에만 등록됨
// (로그아웃 버튼은 confirmLogout이 서버 토큰도 지움)
export function usePushRegistration(isLoggedIn: boolean) {
  const wasLoggedInRef = useRef(false);

  useEffect(() => {
    // 앱 시작 직후(세션 복원 전)의 로그아웃 상태는 건너뜀 — 로그인했다가 로그아웃된 경우에만 폐기
    if (!isLoggedIn && wasLoggedInRef.current) {
      deleteToken(getMessaging()).catch(error =>
        console.log('FCM 토큰 폐기 실패:', error instanceof Error ? error.message : error),
      );
    }
    wasLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

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
