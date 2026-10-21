import { useRef, useState } from 'react';
import { getApiErrorMessage, logApiError } from '@shared/api';
import { showNotice } from '@shared/model';
import { useSessionStore } from '@shared/store/useSessionStore';
import { withdrawApi } from '../api';

// 회원 탈퇴 — 한 번 더 확인받은 뒤 탈퇴 요청, 성공하면 로그아웃(토큰 삭제)하고 시작 화면으로.
// 탈퇴 사유는 받는 API가 없어 화면에서 필수 선택만 하고 서버로 보내지 않음
export function useWithdraw() {
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  // 확인 창이 떠 있는 동안 — 버튼을 빠르게 두 번 눌러 확인 창이 두 개 쌓이지 않게 막음
  const isConfirmingRef = useRef(false);

  const runWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      await withdrawApi();
      useSessionStore.getState().logout();
      showNotice('탈퇴가 완료되었어요', '그동안 케어링을 이용해 주셔서 감사합니다.');
    } catch (error) {
      logApiError('회원 탈퇴 실패', error);
      showNotice('탈퇴하지 못했어요', getApiErrorMessage(error) ?? '잠시 후 다시 시도해 주세요.');
      setIsWithdrawing(false);
    }
  };

  const withdraw = () => {
    if (isWithdrawing || isConfirmingRef.current) return;
    isConfirmingRef.current = true;
    showNotice(
      '정말 탈퇴하시겠어요?',
      '연동된 돌봄대상자 계정과 복약 일정, 건강 기록 등 모든 케어 데이터가 함께 삭제되며 복구할 수 없어요.',
      [
        // 바깥을 눌러 닫을 때도 취소 버튼 동작이 실행됨(NoticeModal)
        { text: '취소', style: 'cancel', onPress: () => (isConfirmingRef.current = false) },
        {
          text: '탈퇴하기',
          style: 'destructive',
          onPress: () => {
            isConfirmingRef.current = false;
            runWithdraw();
          },
        },
      ],
    );
  };

  return { withdraw, isWithdrawing };
}
