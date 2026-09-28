import { useCallback, useState } from 'react';
import { sendSmsCodeApi } from '@features/auth/api';
import { logApiError } from '@shared/api';
import { useSignupDraftStore } from './useSignupDraftStore';

// 본인인증 정보 입력은 이름 → 휴대폰번호 순으로 한 칸씩 위에 추가되는 단계형 폼(Figma 967:5842 ~ 967:6566).
// 시안의 주민번호 앞 7자리·통신사 단계는 가입 API에 받는 필드가 없고(통신사 PASS 인증이 아니라 SMS 인증),
// 쓰지도 않을 주민번호를 수집하는 건 개인정보 보호 측면에서도 부담이라 제외함
export const IDENTITY_STEPS = ['name', 'phone'] as const;
export type IdentityStep = (typeof IDENTITY_STEPS)[number];

const onlyDigits = (value: string) => value.replace(/\D/g, '');

// 010-0000-0000 형태로 표시 — 저장/전송은 숫자만 (백엔드 예시도 01012345678 형태)
export const formatPhoneNumber = (digits: string) => {
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

export function useSignupIdentity(onCodeSent: () => void) {
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [sendError, setSendError] = useState('');

  const step = IDENTITY_STEPS[stepIndex];
  const isVisible = (target: IdentityStep) => IDENTITY_STEPS.indexOf(target) <= stepIndex;

  const isStepValid: Record<IdentityStep, boolean> = {
    name: name.trim().length > 0,
    phone: /^01\d{8,9}$/.test(phone),
  };
  const isLastStep = stepIndex === IDENTITY_STEPS.length - 1;
  // 지금 노출된 필드가 모두 채워져야 "다음"으로 다음 필드를 열거나 인증번호를 보낼 수 있음
  const canProceed = IDENTITY_STEPS.slice(0, stepIndex + 1).every(target => isStepValid[target]);

  const advance = useCallback(() => setStepIndex(prev => Math.min(prev + 1, IDENTITY_STEPS.length - 1)), []);

  const handleChangePhone = (value: string) => setPhone(onlyDigits(value).slice(0, 11));

  // 인증번호 발송 성공 시 이름/전화번호를 저장하고 다음 화면으로
  const requestCode = async () => {
    if (!canProceed || !isLastStep || isSendingCode) return;
    setSendError('');
    setIsSendingCode(true);
    try {
      await sendSmsCodeApi(phone);
      useSignupDraftStore.getState().setIdentity(name.trim(), phone);
      onCodeSent();
    } catch (error) {
      logApiError('SMS 인증번호 발송 실패:', error);
      setSendError('인증번호 발송에 실패했습니다. 휴대폰번호를 확인해 주세요.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // "다음" — 아직 안 열린 칸이 있으면 다음 칸을 열고, 마지막 칸까지 채웠으면 인증번호 발송
  const handleNext = () => {
    if (!canProceed) return;
    if (isLastStep) {
      requestCode();
    } else {
      advance();
    }
  };

  return {
    step,
    isVisible,
    canProceed,
    handleNext,
    name,
    setName,
    phone,
    setPhone: handleChangePhone,
    isSendingCode,
    sendError,
  };
}
