export type TaskAlarmType = 'TTS' | 'VOICE';

// GET/POST/PATCH 공통 응답 형태.
export interface TaskSchedule {
  taskId: number;
  taskName: string;
  locationName: string;
  taskDate: string; // "YYYY-MM-DD"
  // 형식이 스웨거에 "string"으로만 나와 있음 — pill schedule의 takeTime 가정과 동일하게 24시간제로
  // 보되, WheelTimePicker가 초 단위까지 다루므로 "HH:mm:ss"로 가정.
  taskTime: string;
  // 폼의 "음성 알림 시간"(alarmTime)에 대응 — 일정 시간(taskTime)과 별도로 음성 안내를 보낼 시각.
  ttsVoiceTime: string;
  ttsMessage: string;
  alarmType: TaskAlarmType;
  voiceFileUrl: string;
  placeId: number;
}

// POST/PATCH 요청 바디. placeId는 @features/place로 등록/조회한 실제 장소의 id.
export interface TaskScheduleRequest {
  taskName: string;
  locationName: string;
  taskDate: string;
  taskTime: string;
  ttsVoiceTime: string;
  ttsMessage: string;
  alarmType: TaskAlarmType;
  voiceFileUrl: string;
  placeId: number;
}
