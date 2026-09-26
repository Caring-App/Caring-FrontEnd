import { useState } from 'react';
import { usePhoneVerification } from './usePhoneVerification';

// 보호자/돌봄대상자 회원가입 폼이 공유하는 필드(이름/전화번호/인증번호/비밀번호/주소)
// 주소는 기본 주소(검색으로 선택, 필수) + 상세 주소(직접 입력, 선택)로 나눠 받음
export function useSignupFormBase() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [baseAddress, setBaseAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  const phoneVerification = usePhoneVerification();
  const { phone, isPhoneVerified } = phoneVerification;

  const isFormValid = !!name && !!phone && isPhoneVerified && !!password && password === passwordConfirm && !!baseAddress;

  return {
    ...phoneVerification,
    name,
    password,
    passwordConfirm,
    baseAddress,
    detailAddress,
    setName,
    setPassword,
    setPasswordConfirm,
    setBaseAddress,
    setDetailAddress,
    isFormValid,
  };
}
