import { useEffect, useState } from 'react';
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

  useEffect(() => {
    useInquiryStore.getState().fetchInquiry(inquiryId);
  }, [inquiryId]);

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
    canAnswer,
    answerDraft,
    setAnswerDraft: (value: string) => setAnswerDraft(value.slice(0, INQUIRY_CONTENT_MAX_LENGTH)),
    isAnswering,
    submitAnswer,
  };
}
