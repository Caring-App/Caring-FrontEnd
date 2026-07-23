import { useState } from 'react';
import { Clipboard } from 'react-native';

export default function useLinkAccount() {
  const [code, setCode] = useState<string>('');

  // 클립보드 복사 텍스트 붙여넣기
  const handlePaste = async () => {
    const text = await Clipboard.getString();
    if (text) {
      setCode(text.trim());
    }
  };

  // 연동 코드 제출 (백엔드 API 연결 예정 위치)
  const handleSubmit = () => {
    if (!code) return;
    console.log('연동 코드 제출:', code);
    // TODO: 백엔드 POST /api/v1/connect API 연동
  };

  // 코드가 4자리 이상일 때 버튼 활성화 (필요한 최소 자릿수로 수정 가능)
  const isValidCode = code.trim().length >= 4;

  return {
    code,
    setCode,
    handlePaste,
    handleSubmit,
    isValidCode,
  };
}