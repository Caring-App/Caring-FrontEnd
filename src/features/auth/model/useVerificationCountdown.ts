import { useEffect, useState } from 'react';
import { formatRemainingTime, VERIFICATION_SECONDS } from '../utils/verificationCode';

// 인증번호 만료까지 남은 시간 타이머 — 회원가입 인증번호 화면과 비밀번호 찾기 화면이 공유.
// 기기 시계 기준 만료 시각(expiresAt)과 비교해서 계산하므로 앱이 백그라운드에 있다 돌아와도 정확함
export function useVerificationCountdown(startImmediately = false) {
  const [expiresAt, setExpiresAt] = useState<number | null>(() =>
    startImmediately ? Date.now() + VERIFICATION_SECONDS * 1000 : null,
  );
  const [remainingSeconds, setRemainingSeconds] = useState(startImmediately ? VERIFICATION_SECONDS : 0);

  useEffect(() => {
    if (expiresAt === null) return;
    const tick = () => setRemainingSeconds(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  // 인증번호를 (재)발송했을 때 호출
  const restart = () => {
    setExpiresAt(Date.now() + VERIFICATION_SECONDS * 1000);
    setRemainingSeconds(VERIFICATION_SECONDS);
  };

  // 인증이 끝났거나 번호가 바뀌어서 더 셀 필요가 없을 때 호출
  const stop = () => setExpiresAt(null);

  return {
    restart,
    stop,
    isExpired: expiresAt !== null && remainingSeconds === 0,
    remainingTime: formatRemainingTime(remainingSeconds),
  };
}
