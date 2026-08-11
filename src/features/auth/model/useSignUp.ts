import { useSignupFormBase } from './useSignupFormBase';

export default function useSignUp(navigation: any) {
  const base = useSignupFormBase();
  const { name, phone, authCode, password, passwordConfirm, birthDate, address } = base;

  const handleSubmit = () => {
    // TODO: 백엔드 회원가입 API 연동
    console.log('회원가입 제출:', { name, phone, authCode, password, passwordConfirm, birthDate, address });
    navigation.navigate('SignupWelcome', { userName: name });
  };

  return {
    ...base,
    form: { name, phone, authCode, password, passwordConfirm, birthDate, address },
    handleSubmit,
  };
}
