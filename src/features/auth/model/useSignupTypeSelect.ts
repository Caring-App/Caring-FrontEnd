import { UserRole } from '@shared/types';

export function useSignupTypeSelect(navigation: any) {
  const handleRoleSelect = (role: UserRole) => {
    // 선택된 역할(role)을 담아서 약관 동의 화면으로 이동
    navigation.navigate('TermsAgreement', { role });
  };

  return {
    handleRoleSelect,
  };
}
