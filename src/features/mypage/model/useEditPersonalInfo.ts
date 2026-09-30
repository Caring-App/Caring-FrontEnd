import { useState } from 'react';
import { getApiErrorMessage, logApiError } from '@shared/api';
import { showNotice } from '@shared/model';
import { updateMyPageApi } from '../api';
import { combineAddress } from '../utils';

// 개인 정보 수정 — 주소와 비밀번호(PATCH /api/member).
// 서버가 요청의 주소로 항상 덮어쓰는데 현재 주소를 조회하는 API가 없어서, 저장할 때마다 주소를 다시 입력받음.
// 비밀번호 칸을 모두 비워두면 주소만 바뀜
export function useEditPersonalInfo(onSaved: () => void) {
  const [baseAddress, setBaseAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isChangingPassword = !!(currentPassword || newPassword || newPasswordCheck);

  // 입력 중에 바로 보여줄 비밀번호 안내 — 비밀번호 규칙은 서버에도 없어서 확인 일치만 검사
  const passwordError =
    isChangingPassword && newPasswordCheck && newPassword !== newPasswordCheck ? '새 비밀번호가 일치하지 않아요.' : '';

  const isPasswordComplete =
    !isChangingPassword || (!!currentPassword && !!newPassword && !!newPasswordCheck && !passwordError);

  const canSubmit = !!baseAddress && isPasswordComplete && !isSubmitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await updateMyPageApi({
        address: combineAddress(baseAddress, detailAddress),
        ...(isChangingPassword && { currentPassword, newPassword, newPasswordCheck }),
      });
      onSaved();
      showNotice('개인 정보를 수정했어요', isChangingPassword ? '다음 로그인부터 새 비밀번호를 사용해 주세요.' : undefined);
    } catch (error) {
      logApiError('개인 정보 수정 실패', error);
      setSubmitError(getApiErrorMessage(error) ?? '개인 정보를 수정하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    baseAddress,
    setBaseAddress,
    detailAddress,
    setDetailAddress,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    newPasswordCheck,
    setNewPasswordCheck,
    errorMessage: passwordError || submitError,
    canSubmit,
    isSubmitting,
    submit,
  };
}
