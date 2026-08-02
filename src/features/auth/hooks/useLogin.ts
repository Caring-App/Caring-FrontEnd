import { useState } from 'react';
import { useSessionStore } from '@shared/store/useSessionStore';

export const useLogin = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('로그인 시도:', id, password);
    // 실제 로그인 API 연동 로직
  };

  const handleSocialLogin = (platform: string) => {
    console.log(`${platform} 간편 로그인 시도`);
  };

  return { id, setId, password, setPassword, handleLogin, handleSocialLogin };
};