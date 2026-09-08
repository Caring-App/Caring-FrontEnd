import { axiosInstance } from '@shared/api/axiosInstance';
import { NotificationItem } from '../model/types';

// [알림 목록 조회] — 보호자에게 온 알림 전체 조회
export const getNotificationsApi = async (): Promise<NotificationItem[]> => {
  const { data } = await axiosInstance.get<NotificationItem[]>('/api/notification');
  return data;
};

// [알림 읽음 처리]
export const markNotificationReadApi = async (notificationId: number): Promise<void> => {
  await axiosInstance.patch(`/api/notification/${notificationId}/read`);
};
