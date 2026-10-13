import React from 'react';
import { useNoticeStore, useWardFontScaleStore } from '@shared/model';
import { useSessionStore } from '@shared/store/useSessionStore';
import { NoticeModal } from '@shared/ui';

// 앱 전체의 안내·에러 모달을 한 곳에서 그림 — showNotice / notifyLoadFailed로 쌓인 안내를 하나씩 보여줌
export function NoticeHost() {
  const notice = useNoticeStore(state => state.queue[0] ?? null);
  const dismiss = useNoticeStore(state => state.dismiss);
  const isWard = useSessionStore(state => state.isLoggedIn && state.role === 'WARD');
  const wardScale = useWardFontScaleStore(state => state.scale);

  return <NoticeModal notice={notice} onDismiss={dismiss} textScale={isWard ? wardScale : 1} />;
}
