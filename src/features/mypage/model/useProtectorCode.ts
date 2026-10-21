import { useCallback, useEffect, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import { logApiError } from '@shared/api';
import { getProtectorCodeApi } from '../api';

// 연동 코드 확인 모달 — 모달을 열 때 보호자 고유 연동 코드를 조회하고, 복사 버튼으로 클립보드에 복사.
// 모달 위에는 공용 안내 모달이 가려질 수 있어서 조회 실패는 모달 안에 직접 표시
export function useProtectorCode(visible: boolean) {
  const [code, setCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadFailed, setHasLoadFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setHasLoadFailed(false);
    try {
      setCode(await getProtectorCodeApi());
    } catch (error) {
      logApiError('연동 코드 조회 실패', error);
      setHasLoadFailed(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 코드는 바뀌지 않는 값이라 한 번 받아오면 다시 열 때는 조회하지 않음
  useEffect(() => {
    if (!visible) return;
    setCopied(false);
    if (code === null) load();
  }, [visible, code, load]);

  const copy = () => {
    if (!code) return;
    Clipboard.setString(code);
    setCopied(true);
  };

  return { code, isLoading, hasLoadFailed, retry: load, copied, copy };
}
