import { useEffect, useState } from 'react';
import { sendSmsCodeApi, verifySmsCodeApi } from '@features/auth/api';
import { logApiError } from '@shared/api';
import { formatRemainingTime, VERIFICATION_SECONDS } from './useSignupVerificationCode';

// 전화번호 + SMS 인증번호 확인을 한 화면에서 처리하는 흐름 (비밀번호 찾기)
// 전화번호는 숫자만 저장 — 화면에서 하이픈을 붙여 보여주는 건 formatPhoneNumber
export function usePhoneVerification() {
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');

  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [authError, setAuthError] = useState('');
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // 발송 후 ~ 인증 완료 전까지만 남은 시간을 셈 (백엔드 만료 시간 3분과 동일)
  useEffect(() => {
    if (expiresAt === null || isPhoneVerified) return;
    const tick = () => setRemainingSeconds(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt, isPhoneVerified]);

  const isCodeExpired = isCodeSent && !isPhoneVerified && remainingSeconds === 0;

  // 인증 완료 후 전화번호를 다시 바꾸면 이전 인증은 무효로 처리
  const handleSetPhone = (value: string) => {
    setPhone(value.replace(/\D/g, '').slice(0, 11));
    setIsCodeSent(false);
    setIsPhoneVerified(false);
    setExpiresAt(null);
  };

  // 인증번호 입력값이 바뀌면 재확인이 필요하므로 인증 완료 상태 해제
  const handleSetAuthCode = (value: string) => {
    setAuthCode(value.replace(/\D/g, '').slice(0, 6));
    setIsPhoneVerified(false);
  };

  const handleSendAuthCode = async () => {
    if (!phone || isSendingCode) return;
    setAuthError('');
    setIsSendingCode(true);
    try {
      await sendSmsCodeApi(phone);
      setIsCodeSent(true);
      setIsPhoneVerified(false);
      setAuthCode('');
      setExpiresAt(Date.now() + VERIFICATION_SECONDS * 1000);
      setRemainingSeconds(VERIFICATION_SECONDS);
    } catch (error) {
      logApiError('SMS 인증번호 발송 실패:', error);
      setAuthError('인증번호 발송에 실패했습니다. 전화번호를 확인해 주세요.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyAuthCode = async () => {
    if (!authCode || isCodeExpired || isVerifyingCode) return;
    setAuthError('');
    setIsVerifyingCode(true);
    try {
      await verifySmsCodeApi(phone, authCode);
      setIsPhoneVerified(true);
    } catch (error) {
      logApiError('SMS 인증번호 확인 실패:', error);
      setIsPhoneVerified(false);
      setAuthError('인증번호가 일치하지 않습니다.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return {
    phone,
    authCode,
    setPhone: handleSetPhone,
    setAuthCode: handleSetAuthCode,
    handleSendAuthCode,
    handleVerifyAuthCode,
    isSendingCode,
    isCodeSent,
    isVerifyingCode,
    isPhoneVerified,
    isCodeExpired,
    remainingTime: formatRemainingTime(remainingSeconds),
    authError: isCodeExpired && !authError ? '인증 시간이 만료되었습니다. 인증번호를 다시 요청해 주세요.' : authError,
  };
}
