import { useEffect, useState } from 'react';
import { getMyInfoApi, logApiError } from '@shared/api';
import { notifyLoadFailed, showNotice } from '@shared/model';
import { togglePushApi } from '../api';

// 설정 화면의 "APP 푸시 알림" 토글 — 현재 값은 GET /api/member/me, 변경은 POST /api/member/push-toggle.
// 토글 API는 서버 값을 뒤집기만 해서, 현재 값을 모르거나 요청이 진행 중일 땐 누를 수 없게 막음
// (모르는 상태에서 누르면 화면과 서버가 반대로 어긋나고, 연달아 누르면 요청 순서에 따라 결과가 뒤바뀔 수 있음)
export function usePushSetting() {
  const [pushEnabled, setPushEnabled] = useState<boolean | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyInfoApi()
      .then(me => {
        if (!cancelled) setPushEnabled(me.pushEnabled);
      })
      .catch(error => {
        logApiError('푸시 알림 설정 조회 실패', error);
        notifyLoadFailed();
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = async () => {
    if (pushEnabled === null || isToggling) return;
    const next = !pushEnabled;
    // 바로 반영해서 보여주고, 실패하면 되돌림
    setPushEnabled(next);
    setIsToggling(true);
    try {
      await togglePushApi();
    } catch (error) {
      logApiError('푸시 알림 설정 변경 실패', error);
      setPushEnabled(!next);
      showNotice('푸시 알림 설정을 바꾸지 못했어요', '잠시 후 다시 시도해 주세요.');
    } finally {
      setIsToggling(false);
    }
  };

  return {
    pushEnabled: pushEnabled ?? false,
    // 현재 값을 아직 모르면(조회 중·실패) 누를 수 없음
    disabled: pushEnabled === null || isToggling,
    toggle,
  };
}
