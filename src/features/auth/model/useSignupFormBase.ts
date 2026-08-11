import { useState } from 'react';

// 보호자/돌봄대상자 회원가입 폼이 공유하는 필드(이름/전화번호/인증번호/비밀번호/생년월일/주소)
export function useSignupFormBase() {
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

  const isFormValid =
    !!name && !!phone && !!authCode && !!password && password === passwordConfirm && !!birthDate && !!address;

  return {
    name,
    phone,
    authCode,
    password,
    passwordConfirm,
    birthDate,
    address,
    setName,
    setPhone,
    setAuthCode,
    setPassword,
    setPasswordConfirm,
    setBirthDate,
    setAddress,
    handleSendAuthCode,
    isFormValid,
  };
}
