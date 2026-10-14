import { create } from 'zustand';
import { resetOnLogout } from '@shared/store/resetOnLogout';

// 어르신 화면 글자 크기 배율(보통=1) — WardText, 안내 모달, 각 feature의 어르신 카드가 같이 읽어서 shared에 둠.
// 값은 보호자가 돌봄대상자 관리 탭에서 설정한 화면 설정이고, 서버 조회는 ward-management의 fetchWardFontScale이 함
interface WardFontScaleState {
  scale: number;
  setScale: (scale: number) => void;
}

export const useWardFontScaleStore = create<WardFontScaleState>(set => ({
  scale: 1,
  setScale: scale => set({ scale }),
}));

resetOnLogout(useWardFontScaleStore);
