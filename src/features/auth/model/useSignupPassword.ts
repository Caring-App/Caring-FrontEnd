import { useState } from 'react';
import { isValidPassword, PASSWORD_RULE_MESSAGE } from '../utils/passwordRule';
import { useSignupDraftStore } from './useSignupDraftStore';

// 회원가입 비밀번호 단계 (Figma 970:7578) — 규칙은 앱에서만 검사함(백엔드는 비밀번호 = 확인 일치만 검사)
export function useSignupPassword(onDone: () => void) {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const isPasswordValid = isValidPassword(password);
  const isConfirmMatched = password === passwordConfirm;
  const canProceed = isPasswordValid && isConfirmMatched;

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
    passwordError: password && !isPasswordValid ? `${PASSWORD_RULE_MESSAGE}으로 입력해 주세요.` : undefined,
    confirmError: passwordConfirm && !isConfirmMatched ? '비밀번호가 일치하지 않습니다.' : undefined,
    handleNext,
  };
}
