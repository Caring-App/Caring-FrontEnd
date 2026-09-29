import type { AlarmType, SoundType } from '@shared/types';

// 화면의 음성 알림 선택값(SoundType) ↔ 백엔드 AlarmType 변환 — 복약·일정 스케줄 공용
export function soundTypeToAlarmType(soundType: SoundType): AlarmType {
  return soundType === 'voice' ? 'VOICE_RECORD' : 'TTS';
}

export function alarmTypeToSoundType(alarmType: AlarmType): SoundType {
  return alarmType === 'VOICE_RECORD' ? 'voice' : 'tts';
}
