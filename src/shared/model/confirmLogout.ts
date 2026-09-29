import { useSessionStore } from '@shared/store/useSessionStore';
import { showNotice } from './useNoticeStore';

// 로그아웃 확인 — 보호자 마이페이지·사이드바, 어르신 홈의 로그아웃 버튼이 같이 씀.
// (세션 스토어에서 바로 안내 모달을 부르면 안내 스토어 → 로그아웃 초기화 → 세션 스토어로 순환 참조가 생겨 여기 둠)
export function confirmLogout() {
  showNotice('로그아웃 하시겠어요?', '언제든지 다시 로그인하실 수 있어요.', [
    { text: '취소', style: 'cancel' },
    { text: '로그아웃', onPress: () => useSessionStore.getState().logout() },
  ]);
}
