import type { ConnectionFontSize } from '@features/account-link/model';

export type FontSizeOption = 'small' | 'medium' | 'large';

export interface Ward {
  id: string;
  nickname: string;
  name: string;
  phone: string;
  address: string;
  // TTS 재생 속도 배율. 0.5 / 0.75 / 1.0 / 1.25 / 1.5 다섯 단계만 유효함(TTS_RATE_STEPS 참고)
  ttsRate: number;
  fontSize: FontSizeOption;
}

export type WardInfo = Pick<Ward, 'nickname' | 'name' | 'phone' | 'address'>;

// GET /api/ward-setting/{wardId}
export interface WardSetting {
  wardSettingId: number;
  wardId: number;
  fontSize: ConnectionFontSize;
  ttsRate: number;
}

// PATCH /api/ward-setting/{wardId}
export interface UpdateWardSettingRequest {
  fontSize: ConnectionFontSize;
  ttsRate: number;
}
