import { create } from 'zustand';
import { logApiError } from '@shared/api';
import { getNotificationsApi, markNotificationReadApi } from '../api';
import { NotificationItem } from './types';

interface NotificationState {
  notifications: NotificationItem[];
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const notifications = await getNotificationsApi();
      set({ notifications });
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
    }
  },
}));
