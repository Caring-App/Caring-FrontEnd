import { useState } from 'react';

export default function useSignUp(navigation: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');

  const handleSendAuthCode = () => {
    // TODO: 백엔드 인증번호 발송 API 연동
    console.log('인증번호 발송 요청:', phone);
  };

  const handleSubmit = () => {
    // TODO: 백엔드 회원가입 API 연동
    console.log('회원가입 제출:', { name, phone, authCode, password, passwordConfirm, birthDate, address });
    navigation.navigate('SignupWelcome', { userName: name });
  };

  const isFormValid =
    !!name && !!phone && !!authCode && !!password && password === passwordConfirm && !!birthDate && !!address;

  return {
    form: { name, phone, authCode, password, passwordConfirm, birthDate, address },
    setName,
    setPhone,
    setAuthCode,
    setPassword,
    setPasswordConfirm,
    setBirthDate,
    setAddress,
    handleSendAuthCode,
    handleSubmit,
    isFormValid,
  };
}
