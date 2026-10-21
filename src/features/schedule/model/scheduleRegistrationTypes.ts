import type { SoundType, TimeState } from '@shared/types';

export type { TimeState };

export type ScheduleSoundType = SoundType;

export interface ScheduleRegistrationData {
  title: string;
  location: string;
  // @features/place에 등록된 실제 장소의 id — 장소는 이제 자유 텍스트가 아니라 이 도메인에서 고른 값.
  placeId: number;
  date: Date;
  scheduleTime: TimeState;
  alarmTime: TimeState;
  soundType: ScheduleSoundType;
  // 보호자 음성 녹음 파일 URL(POST /api/voice/upload 결과). 기본 알림음(TTS)이면 빈 문자열
  voiceFileUrl: string;
}

export interface ScheduleEntry extends ScheduleRegistrationData {
  id: number;
}
