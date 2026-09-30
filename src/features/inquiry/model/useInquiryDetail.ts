import { useCallback, useEffect, useState } from 'react';
import { useSessionStore } from '@shared/store/useSessionStore';
import { INQUIRY_CONTENT_MAX_LENGTH } from './types';
import { useInquiryStore } from './useInquiryStore';

// 문의 상세 — 목록에서 받은 값을 먼저 보여주고, 최신 답변 상태를 위해 들어올 때마다 다시 조회.
// 관리자(authLevel ADMIN)면 답변 등록 입력도 제공
export function useInquiryDetail(inquiryId: number) {
  const inquiry = useInquiryStore(
    state => state.inquiryById[inquiryId] ?? state.inquiries.find(item => item.inquiryId === inquiryId),
  );
  const isAdmin = useSessionStore(state => state.profile?.authLevel === 'ADMIN');
  const [answerDraft, setAnswerDraft] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  // 상세 조회 실패 여부 — 목록에 없는 문의(삭제·권한 없음 등)면 보여줄 값이 없어 로딩 대신 다시 시도 안내를 띄움
  const [hasLoadFailed, setHasLoadFailed] = useState(false);

  const load = useCallback(async () => {
    setHasLoadFailed(false);
    const succeeded = await useInquiryStore.getState().fetchInquiry(inquiryId);
    if (!succeeded) setHasLoadFailed(true);
  }, [inquiryId]);

  useEffect(() => {
    load();
  }, [load]);

  const canAnswer = isAdmin && !!inquiry && !inquiry.answered;

  const submitAnswer = async () => {
    if (!canAnswer || !answerDraft.trim() || isAnswering) return;
    setIsAnswering(true);
    const succeeded = await useInquiryStore.getState().answerInquiry(inquiryId, answerDraft.trim());
    setIsAnswering(false);
    if (succeeded) setAnswerDraft('');
  };

  return {
    inquiry,
    hasLoadFailed,
    retry: load,
    canAnswer,
    answerDraft,
    setAnswerDraft: (value: string) => setAnswerDraft(value.slice(0, INQUIRY_CONTENT_MAX_LENGTH)),
    isAnswering,
    submitAnswer,
  };
}
