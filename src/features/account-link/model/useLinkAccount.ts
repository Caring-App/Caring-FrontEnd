import { useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { linkConnectionApi } from '@features/account-link/api';
import { logApiError } from '@shared/api';

export default function useLinkAccount() {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 클립보드 복사 텍스트 붙여넣기
  const handlePaste = async () => {
    const text = await Clipboard.getString();
    if (text) {
      setCode(text.trim());
    }
  };

  // 연동 코드 제출 — 성공 시 응답(wardName 등)을 반환, 실패 시 null을 반환하고 submitError를 채움
  const handleSubmit = async () => {
    if (!code || isSubmitting) return null;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      return await linkConnectionApi({ protectorCode: code });
    } catch (error) {
      logApiError('연동 코드 제출 실패:', error);
      setSubmitError('연동 코드가 올바르지 않습니다. 다시 확인해 주세요.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 코드가 4자리 이상일 때 버튼 활성화 (필요한 최소 자릿수로 수정 가능)
  const isValidCode = code.trim().length >= 4;

  return {
    code,
    setCode,
    handlePaste,
    handleSubmit,
    isValidCode,
    isSubmitting,
    submitError,
  };
}
