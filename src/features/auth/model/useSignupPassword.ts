import { useState } from 'react';
import { useSignupDraftStore } from './useSignupDraftStore';

// 회원가입 비밀번호 단계 (Figma 970:7578) — 비밀번호 규칙(길이·문자 조합)은 두지 않음. 백엔드도 비밀번호 = 확인 일치만 검사
export function useSignupPassword(onDone: () => void) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const isConfirmMatched = password === passwordConfirm;
  const canProceed = !!password && isConfirmMatched;

  const handleNext = () => {
    if (!canProceed) return;
    useSignupDraftStore.getState().setPassword(password, passwordConfirm);
    onDone();
  };

  return {
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    canProceed,
    confirmError: passwordConfirm && !isConfirmMatched ? '비밀번호가 일치하지 않습니다.' : undefined,
    handleNext,
  };
}
