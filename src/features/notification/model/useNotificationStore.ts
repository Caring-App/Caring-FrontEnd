import { create } from 'zustand';
import { logApiError } from '@shared/api';
import { getNotificationsApi, markNotificationReadApi } from '../api';
import { NotificationItem } from './types';

interface NotificationState {
  notifications: NotificationItem[];
  isLoading: boolean;
  // 읽음 처리 요청이 아직 서버에 반영됐는지 확인 못 한 알림 id 집합 — fetchNotifications가 그 사이에
  // 끼어들어 아직 PATCH가 반영되기 전의(읽음 처리 전) 응답을 그대로 덮어써서 낙관적으로 읽음 표시한
  // 상태가 다시 안 읽음으로 되돌아가는 걸 막는 용도.
  pendingReadIds: Set<number>;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isLoading: false,
  pendingReadIds: new Set(),

  // 화면 재포커스마다 호출되므로(NotificationScreen의 useFocusEffect), 이미 조회 중이면 중복 요청을
  // 막음 — 안 그러면 먼저 보낸 요청의 응답이 나중에 도착해 최신 상태를 덮어쓸 수 있음
  // (useWardLocationStore.fetchLocation의 loadingWardIds 가드와 같은 이유).
  fetchNotifications: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const notifications = await getNotificationsApi();
      const { pendingReadIds } = get();
      set({
        notifications: pendingReadIds.size
          ? notifications.map(item =>
              pendingReadIds.has(item.notificationId) ? { ...item, isRead: true } : item,
            )
          : notifications,
      });
    } catch (error) {
      logApiError('알림 목록 조회 실패', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 이미 읽은 알림이면 다시 요청을 보내지 않음. 먼저 로컬 상태를 읽음으로 바꾸고(카드를 누르면 바로
  // 읽음 표시가 사라져야 자연스러움), 실패하면 원래 상태로 되돌림.
  markAsRead: async notificationId => {
    const target = get().notifications.find(item => item.notificationId === notificationId);
    if (!target || target.isRead) return;

    set(state => ({
      notifications: state.notifications.map(item =>
        item.notificationId === notificationId ? { ...item, isRead: true } : item,
      ),
      pendingReadIds: new Set(state.pendingReadIds).add(notificationId),
    }));

    try {
      await markNotificationReadApi(notificationId);
    } catch (error) {
      logApiError('알림 읽음 처리 실패', error);
      set(state => ({
        notifications: state.notifications.map(item =>
          item.notificationId === notificationId ? { ...item, isRead: false } : item,
        ),
      }));
    } finally {
      set(state => {
        const next = new Set(state.pendingReadIds);
        next.delete(notificationId);
        return { pendingReadIds: next };
      });
    }
  },
}));
