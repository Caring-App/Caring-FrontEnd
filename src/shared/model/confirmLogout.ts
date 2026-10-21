import { logApiError, updateFcmTokenApi } from '@shared/api';
import { useSessionStore } from '@shared/store/useSessionStore';
import { showNotice } from './useNoticeStore';

const FCM_CLEAR_WAIT_MS = 1500;

// 로그아웃 확인 — 보호자 마이페이지·사이드바, 어르신 홈의 로그아웃 버튼이 같이 씀.
// (세션 스토어에서 바로 안내 모달을 부르면 안내 스토어 → 로그아웃 초기화 → 세션 스토어로 순환 참조가 생겨 여기 둠)
export function confirmLogout() {
  showNotice('로그아웃 하시겠어요?', '언제든지 다시 로그인하실 수 있어요.', [
    { text: '취소', style: 'cancel' },
    {
      text: '로그아웃',
      onPress: async () => {
        // 서버에 남은 이 기기의 FCM 토큰도 지움(인증 토큰을 지우기 전에 보내야 해서 로그아웃보다 먼저 보냄).
        // 로그아웃되면 기기 쪽 토큰은 usePushRegistration이 폐기해서 이 요청이 실패해도 이전 계정 알림은 안 옴
        // → 응답을 끝까지 기다리지 않고 최대 FCM_CLEAR_WAIT_MS만 기다림(네트워크가 느리면 로그아웃이 멈춘 것처럼 보일 수 있음)
        const clearRequest = updateFcmTokenApi('').catch(error => logApiError('로그아웃 중 FCM 토큰 삭제 실패', error));
        await Promise.race([clearRequest, new Promise<void>(resolve => setTimeout(resolve, FCM_CLEAR_WAIT_MS))]);
        useSessionStore.getState().logout();
      },
    },
  ]);
}
