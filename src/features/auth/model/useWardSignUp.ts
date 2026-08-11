import { useState } from 'react';

export default function useWardSignUp(navigation: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);

  const handleSendAuthCode = () => {
    // TODO: 백엔드 인증번호 발송 API 연동
    console.log('인증번호 발송 요청:', phone);
  };

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

  const isFormValid =
    !!name && !!phone && !!authCode && !!password && password === passwordConfirm && !!birthDate && !!address;

  return {
    form: { name, phone, authCode, password, passwordConfirm, birthDate, address, selectedDiseases },
    setName,
    setPhone,
    setAuthCode,
    setPassword,
    setPasswordConfirm,
    setBirthDate,
    setAddress,
    toggleDisease,
    handleSendAuthCode,
    handleSubmit,
    isFormValid,
  };
}
