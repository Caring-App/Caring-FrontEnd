import { useState } from 'react';
import { useSignupFormBase } from './useSignupFormBase';

export default function useWardSignUp(navigation: any) {
  const base = useSignupFormBase();
  const { name, phone, authCode, password, passwordConfirm, birthDate, address } = base;
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);

  // 기저 질환은 중복 선택 가능 (Figma 504:13234)
  const toggleDisease = (disease: string) => {
    setSelectedDiseases((prev) =>
      prev.includes(disease) ? prev.filter((item) => item !== disease) : [...prev, disease],
    );
  };

  const handleSubmit = () => {
    // TODO: 백엔드 회원가입 API 연동
    console.log('돌봄대상자 회원가입 제출:', {
      name,
      phone,
      authCode,
      password,
      passwordConfirm,
      birthDate,
      address,
      selectedDiseases,
    });
    navigation.navigate('WardSignupWelcome', { userName: name });
  };

  return {
    ...base,
    form: { name, phone, authCode, password, passwordConfirm, birthDate, address, selectedDiseases },
    toggleDisease,
    handleSubmit,
  };
}
