import { create } from 'zustand';
import { resetOnLogout } from '@shared/store/resetOnLogout';
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
  // 조회가 실패해서 기본 배율(1)로 남아있는 상태인지 여부. true면 "보통 크기가 실제로 설정된 값"이
  // 아니라 "설정을 못 받아온 것"이므로, isLoaded만 보고는 구분이 안 되는 문제를 보완하기 위한 플래그.
  hasError: boolean;
  fetchFontScale: (wardId: number) => Promise<void>;
}

export const useWardFontScaleStore = create<WardFontScaleState>(set => ({
  scale: 1,
  isLoaded: false,
  hasError: false,
  fetchFontScale: async wardId => {
    try {
      const setting = await getWardSettingApi(wardId);
      set({ scale: SCALE_BY_OPTION[connectionFontSizeToOption(setting.fontSize)], isLoaded: true, hasError: false });
    } catch (error) {
      logApiError('어르신 글자 크기 설정 조회 실패', error);
      // 저장 안 된 상태에서 화면이 깨지면 안 되므로 배율은 기본값(1) 유지 — 다만 hasError로 이게
      // "정상적으로 보통 크기가 설정된 것"과는 다른, 조회 실패 상태임을 구분해서 남겨둠.
      set({ isLoaded: true, hasError: true });
    }
  },
}));

resetOnLogout(useWardFontScaleStore);
