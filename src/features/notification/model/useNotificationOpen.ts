import { useEffect, useRef } from 'react';
import {
  getInitialNotification,
  getMessaging,
  onNotificationOpenedApp,
  type RemoteMessage,
} from '@react-native-firebase/messaging';

// 이미 처리한 알림 — getInitialNotification은 같은 실행 동안 같은 알림을 다시 돌려줄 수 있어서,
// 로그아웃 후 재로그인 등으로 이 훅이 다시 마운트돼도 같은 알림으로 또 이동하지 않게 함
const handledMessageIds = new Set<string>();

// 시스템 알림을 눌러 앱이 열렸을 때 onOpen을 부름 — 백그라운드에서 눌렀을 때(onNotificationOpenedApp)와
// 앱이 꺼진 상태에서 알림으로 켜졌을 때(getInitialNotification) 둘 다 처리.
// 어디로 이동할지는 화면 구조를 아는 app 레이어(내비게이터)가 정함
export function useNotificationOpen(onOpen: (message: RemoteMessage) => void) {
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    const messaging = getMessaging();
    const handle = (message: RemoteMessage | null) => {
      if (!message) return;
      const id = message.messageId;
      if (id) {
        if (handledMessageIds.has(id)) return;
        handledMessageIds.add(id);
      }
      onOpenRef.current(message);
    };

    getInitialNotification(messaging)
      .then(handle)
      .catch(error => console.log('알림으로 연 앱 확인 실패:', error instanceof Error ? error.message : error));
    return onNotificationOpenedApp(messaging, handle);
  }, []);
}
