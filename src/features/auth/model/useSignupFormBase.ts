import { useState } from 'react';
import { usePhoneVerification } from './usePhoneVerification';

// 보호자/돌봄대상자 회원가입 폼이 공유하는 필드(이름/전화번호/인증번호/비밀번호/주소)
export function useSignupFormBase() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [address, setAddress] = useState('');

  const phoneVerification = usePhoneVerification();
  const { phone, isPhoneVerified } = phoneVerification;

  const isFormValid = !!name && !!phone && isPhoneVerified && !!password && password === passwordConfirm && !!address;

  return {
    ...phoneVerification,
    name,
    password,
    passwordConfirm,
    address,
    setName,
    setPassword,
    setPasswordConfirm,
    setAddress,
    isFormValid,
  };
}
