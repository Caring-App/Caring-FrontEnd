import { useState } from 'react';
import { sendSmsCodeApi, verifySmsCodeApi } from '@features/auth/api';
import { logApiError } from '@shared/api';
import { normalizePhoneDigits } from '../utils/phone';
import { normalizeVerificationCode } from '../utils/verificationCode';
import { useVerificationCountdown } from './useVerificationCountdown';

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
  // 발송 후 ~ 인증 완료 전까지만 남은 시간을 셈
  const countdown = useVerificationCountdown();

  const isCodeExpired = isCodeSent && !isPhoneVerified && countdown.isExpired;

  // 인증 완료 후 전화번호를 다시 바꾸면 이전 인증은 무효로 처리
  const handleSetPhone = (value: string) => {
    setPhone(normalizePhoneDigits(value));
    setIsCodeSent(false);
    setIsPhoneVerified(false);
    countdown.stop();
  };

  // 인증번호 입력값이 바뀌면 재확인이 필요하므로 인증 완료 상태 해제
  const handleSetAuthCode = (value: string) => {
    setAuthCode(normalizeVerificationCode(value));
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
      countdown.restart();
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
      countdown.stop();
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
    remainingTime: countdown.remainingTime,
    authError: isCodeExpired && !authError ? '인증 시간이 만료되었습니다. 인증번호를 다시 요청해 주세요.' : authError,
  };
}
