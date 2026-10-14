import { logApiError } from '@shared/api';
import { useWardFontScaleStore } from '@shared/model';
import { getWardSettingApi } from '../api';
import { connectionFontSizeToOption } from '../utils';
import { FontSizeOption } from './types';

// 로컬 FontSizeOption → 실제 화면에 곱할 배율. medium(보통)=1을 기준으로 위아래 대칭.
const SCALE_BY_OPTION: Record<FontSizeOption, number> = {
  small: 0.88,
  medium: 1,
  large: 1.18,
};

// 보호자가 설정한 어르신 글자 크기를 서버에서 받아 공용 배율(useWardFontScaleStore)에 반영 — 어르신 홈 진입 시 호출
export async function fetchWardFontScale(wardId: number) {
  try {
    const setting = await getWardSettingApi(wardId);
    useWardFontScaleStore.getState().setScale(SCALE_BY_OPTION[connectionFontSizeToOption(setting.fontSize)]);
  } catch (error) {
    // 조회에 실패해도 화면이 깨지면 안 되므로 기본 배율(1) 유지
    logApiError('어르신 글자 크기 설정 조회 실패', error);
  }
}
