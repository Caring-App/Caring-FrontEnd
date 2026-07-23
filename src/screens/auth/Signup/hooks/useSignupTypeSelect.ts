import { UserRole } from '../types/signupType.types';

export function useSignupTypeSelect(navigation: any) {
  const handleRoleSelect = (role: UserRole) => {
    // 선택된 역할(role)을 담아서 실제 회원가입 폼 화면으로 이동
    navigation.navigate('SignupScreen', { role });
  };

  return {
    handleRoleSelect,
  };
}