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

// 돌봄대상자 정보 수정 모달에서 저장할 값. 주소는 새로 검색해서 바꾼 경우에만 채워짐(바꾸지 않으면 undefined)
export interface WardInfoUpdate extends Pick<Ward, 'nickname' | 'name' | 'phone'> {
  newAddress?: { baseAddress: string; detailAddress: string };
}

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
