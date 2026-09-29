import React from 'react';
import { useNoticeStore } from '@shared/model';
import { useSessionStore } from '@shared/store/useSessionStore';
import { NoticeModal } from '@shared/ui';
// 어르신 화면 글자 크기 배율은 ward-management가 유일한 소스라 app 레이어에서 가져와 넘김(shared는 feature를 참조하지 않음)
import { useWardFontScaleStore } from '@features/ward-management/model';

// 앱 전체의 안내·에러 모달을 한 곳에서 그림 — showNotice / notifyLoadFailed로 쌓인 안내를 하나씩 보여줌
export function NoticeHost() {
  const notice = useNoticeStore(state => state.queue[0] ?? null);
  const dismiss = useNoticeStore(state => state.dismiss);
  const isWard = useSessionStore(state => state.isLoggedIn && state.role === 'WARD');
  const wardScale = useWardFontScaleStore(state => state.scale);

  return <NoticeModal notice={notice} onDismiss={dismiss} textScale={isWard ? wardScale : 1} />;
}
