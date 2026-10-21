import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@app/navigation/types';
import { resetPasswordApi } from '@features/auth/api';
import { logApiError } from '@shared/api';
import { usePhoneVerification } from './usePhoneVerification';
import { showNotice } from '@shared/model';

export default function useResetPassword() {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const phoneVerification = usePhoneVerification();
  const { phone, authCode, isPhoneVerified } = phoneVerification;

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isFormValid = isPhoneVerified && !!newPassword && newPassword === newPasswordConfirm;

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await resetPasswordApi({
        phone,
        authNumber: authCode,
        newPassword,
        newPasswordCheck: newPasswordConfirm,
      });
      showNotice('완료', '비밀번호가 변경되었습니다. 새 비밀번호로 다시 로그인해 주세요.', [
        { text: '확인', onPress: () => navigation.navigate('PhoneLogin') },
      ]);
    } catch (error) {
      logApiError('비밀번호 재설정 실패:', error);
      setSubmitError('비밀번호 재설정에 실패했습니다. 입력하신 정보를 다시 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...phoneVerification,
    newPassword,
    setNewPassword,
    newPasswordConfirm,
    setNewPasswordConfirm,
    isFormValid,
    isSubmitting,
    submitError,
    handleSubmit,
  };
}
