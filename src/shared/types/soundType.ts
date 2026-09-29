export type SoundType = 'tts' | 'voice';

// 백엔드 공통 AlarmType enum(com.caring.global.common.AlarmType, Swagger: TTS | VOICE_RECORD) — 복약·일정 스케줄이 같이 씀.
// VOICE_RECORD는 voiceFileUrl이 비어 있으면 서버가 거부함(AlarmValidationUtil)
export type AlarmType = 'TTS' | 'VOICE_RECORD';
