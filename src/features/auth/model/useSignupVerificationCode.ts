import { useState } from 'react';
import { sendSmsCodeApi, verifySmsCodeApi } from '@features/auth/api';
import { logApiError } from '@shared/api';
import { normalizeVerificationCode } from '../utils/verificationCode';
import { useSignupDraftStore } from './useSignupDraftStore';
import { useVerificationCountdown } from './useVerificationCountdown';

// 인증번호 입력 화면 — 본인인증 화면에서 이미 1회 발송된 상태로 진입하므로 마운트 시점부터 타이머 시작
export function useSignupVerificationCode(onVerified: () => void) {
  const phone = useSignupDraftStore(state => state.phone);
  const [code, setCode] = useState('');
  const countdown = useVerificationCountdown(true);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const { isExpired } = countdown;

  const handleChangeCode = (value: string) => setCode(normalizeVerificationCode(value));

  const resend = async () => {
    if (isResending) return;
    setError('');
    setIsResending(true);
    try {
      await sendSmsCodeApi(phone);
      setCode('');
      countdown.restart();
    } catch (resendError) {
      logApiError('SMS 인증번호 재발송 실패:', resendError);
      setError('인증번호 재요청에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsResending(false);
    }
  };

  const verify = async () => {
    if (!code || isExpired || isVerifying) return;
    setError('');
    setIsVerifying(true);
    try {
      await verifySmsCodeApi(phone, code);
      useSignupDraftStore.getState().setAuthCode(code);
      onVerified();
    } catch (verifyError) {
      logApiError('SMS 인증번호 확인 실패:', verifyError);
      setError('인증번호가 일치하지 않습니다.');
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    code,
    setCode: handleChangeCode,
    remainingTime: countdown.remainingTime,
    isExpired,
    resend,
    isResending,
    verify,
    isVerifying,
    error: isExpired && !error ? '인증 시간이 만료되었습니다. 인증번호를 재요청해 주세요.' : error,
  };
}
