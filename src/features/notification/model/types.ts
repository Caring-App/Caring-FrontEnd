export interface NotificationItem {
  notificationId: number;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

// 서버가 FCM 메시지 data에 넣어 보내는 값(전부 문자열). 어르신 복약·재알림·일정 알림에만 옴 — 보호자 알림엔 data가 없음.
// voiceFileUrl은 보호자 음성이든 기본 알림음(TTS)이든 서버가 만든 음성 파일 주소라 그대로 재생하면 됨
export interface PushAlarmData {
  alarmType?: 'TTS' | 'VOICE_RECORD';
  voiceFileUrl?: string;
  ttsMessage?: string;
  pillLogId?: string;
  taskId?: string;
}
