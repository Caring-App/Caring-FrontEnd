import { useState } from 'react';
// 휴대폰 인증(발송·확인·타이머)은 비밀번호 찾기와 같은 흐름이라 auth의 훅을 그대로 재사용함
// (순환참조 없음, auth는 mypage를 참조하지 않음)
import { usePhoneVerification } from '@features/auth/model';
import { getApiErrorMessage, logApiError } from '@shared/api';
import { changePhoneApi } from '../api';

// 개인 정보 수정 — 전화번호 변경. 새 번호로 SMS 인증을 마친 뒤(서버가 인증 완료 여부를 확인함)
// 같은 인증번호와 함께 변경 요청.
// 결과는 모달 안에 직접 보여줌 — 모달을 닫으면 함께 입력 중이던 주소·비밀번호가 사라지기 때문
export function useChangePhone() {
  const verification = usePhoneVerification();
  const [isChanging, setIsChanging] = useState(false);
  const [changeError, setChangeError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const canChange = verification.isPhoneVerified && !isChanging;

  const clearResult = () => {
    setChangeError('');
    setSuccessMessage('');
  };

  const changePhone = async () => {
    if (!canChange) return;
    clearResult();
    setIsChanging(true);
    try {
      await changePhoneApi({ newPhone: verification.phone, authNumber: verification.authCode });
      setSuccessMessage('전화번호가 변경되었어요. 다음 로그인부터 새 번호로 로그인해 주세요.');
      verification.setPhone('');
    } catch (error) {
      logApiError('전화번호 변경 실패', error);
      // 서버는 변경 요청을 받으면 결과와 상관없이 인증 정보를 먼저 지움(중복 번호·인증 만료 등으로 실패해도 동일) —
      // 인증 완료 상태로 남겨두면 인증번호를 다시 받을 수 없어 갇히므로 인증부터 다시 하게 초기화
      verification.setPhone(verification.phone);
      const message = getApiErrorMessage(error) ?? '전화번호를 변경하지 못했어요.';
      setChangeError(`${message} 인증번호를 다시 받아 주세요.`);
    } finally {
      setIsChanging(false);
    }
  };

  return {
    ...verification,
    setPhone: (value: string) => {
      clearResult();
      verification.setPhone(value);
    },
    handleSendAuthCode: () => {
      clearResult();
      return verification.handleSendAuthCode();
    },
    // 인증 오류(발송·확인 실패, 만료)와 변경 요청 실패를 한 줄로 보여줌
    errorMessage: verification.authError || changeError,
    successMessage,
    canChange,
    isChanging,
    changePhone,
  };
}
