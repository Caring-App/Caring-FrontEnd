import { useEffect, useState } from 'react';
import { getApiErrorMessage, getMyInfoApi, logApiError } from '@shared/api';
import { notifyLoadFailed, showNotice } from '@shared/model';
import { updateMyPageApi } from '../api';

// 개인 정보 수정 — 주소와 비밀번호(PATCH /api/member).
// 열 때 현재 주소(GET /api/member/me)를 채워 두고, 주소를 바꿨을 때만 주소를 보냄(안 보내면 서버가 기존 주소 유지).
// 주소 조회가 실패해도 비밀번호는 바꿀 수 있게 막지 않음
// visible: 모달이 실제로 열렸을 때만 조회 — 마이페이지 진입만으로 조회(와 실패 안내)가 일어나지 않게
export function useEditPersonalInfo(onSaved: () => void, visible: boolean) {
  const [baseAddress, setBaseAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  // 서버에서 받아온 주소 — 입력값과 비교해서 주소를 바꿨는지 판단
  const [loadedAddress, setLoadedAddress] = useState({ baseAddress: '', detailAddress: '' });
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setIsLoadingAddress(true);
    getMyInfoApi()
      .then(me => {
        if (cancelled) return;
        // 예전 마이페이지 수정으로 기본 주소가 갱신되지 않은 회원은 상세 주소에 전체 주소가 들어올 수 있음 —
        // 주소를 안 건드리면 보내지 않으니 그대로 둬도 기존 값이 망가지지 않음
        const address = { baseAddress: me.baseAddress ?? '', detailAddress: me.detailAddress ?? '' };
        setLoadedAddress(address);
        setBaseAddress(address.baseAddress);
        setDetailAddress(address.detailAddress);
      })
      .catch(error => {
        logApiError('내 정보 조회 실패', error);
        notifyLoadFailed();
      })
      .finally(() => {
        if (!cancelled) setIsLoadingAddress(false);
      });
    return () => {
      cancelled = true;
    };
  }, [visible]);

  const isChangingAddress =
    baseAddress !== loadedAddress.baseAddress || detailAddress !== loadedAddress.detailAddress;
  const isChangingPassword = !!(currentPassword || newPassword || newPasswordCheck);

  // 입력 중에 바로 보여줄 비밀번호 안내 — 비밀번호 규칙은 서버에도 없어서 확인 일치만 검사
  const passwordError =
    isChangingPassword && newPasswordCheck && newPassword !== newPasswordCheck ? '새 비밀번호가 일치하지 않아요.' : '';

  const isPasswordComplete =
    !isChangingPassword || (!!currentPassword && !!newPassword && !!newPasswordCheck && !passwordError);

  const canSubmit =
    (isChangingAddress || isChangingPassword) &&
    (!isChangingAddress || !!baseAddress) &&
    isPasswordComplete &&
    !isLoadingAddress &&
    !isSubmitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await updateMyPageApi({
        ...(isChangingAddress && { baseAddress, detailAddress: detailAddress.trim() }),
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
