import { create } from 'zustand';
import { logApiError } from '@shared/api';
import { getWardSettingApi } from '../api';
import { connectionFontSizeToOption } from '../utils';
import { FontSizeOption } from './types';

// 로컬 FontSizeOption → 실제 화면에 곱할 배율. medium(보통)=1을 기준으로 위아래 대칭.
const SCALE_BY_OPTION: Record<FontSizeOption, number> = {
  small: 0.88,
  medium: 1,
  large: 1.18,
};

interface WardFontScaleState {
  scale: number;
  isLoaded: boolean;
  // 보호자가 돌봄대상자 관리 탭에서 설정한 글자 크기(GET /api/ward-setting/{wardId})를 실제로
  // 어르신 화면에 반영하기 위한 배율. 이 어르신의 ward-setting 레코드가 아직 없으면(400) 기본값(1)
  // 유지 — 저장 안 된 상태에서 화면이 깨지면 안 되므로.
  fetchFontScale: (wardId: number) => Promise<void>;
}

export const useWardFontScaleStore = create<WardFontScaleState>(set => ({
  scale: 1,
  isLoaded: false,
  fetchFontScale: async wardId => {
    try {
      const setting = await getWardSettingApi(wardId);
      set({ scale: SCALE_BY_OPTION[connectionFontSizeToOption(setting.fontSize)], isLoaded: true });
    } catch (error) {
      logApiError('어르신 글자 크기 설정 조회 실패', error);
      set({ isLoaded: true });
    }
  },
}));
