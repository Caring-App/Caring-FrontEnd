import { useState } from 'react';
import { showNotice } from '@shared/model';
import { INQUIRY_CONTENT_MAX_LENGTH, INQUIRY_TITLE_MAX_LENGTH } from './types';
import { useInquiryStore } from './useInquiryStore';

// 문의 작성 화면 — 제목·내용 입력과 등록
export function useInquiryWriteForm(onSubmitted: () => void) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !isSubmitting;

  const submit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    const succeeded = await useInquiryStore.getState().createInquiry(title.trim(), content.trim());
    setIsSubmitting(false);
    if (succeeded) {
      showNotice('문의가 등록되었어요', '답변이 등록되면 문의 목록에서 확인하실 수 있어요.', [
        { text: '확인', onPress: onSubmitted },
      ]);
    }
  };

  return {
    title,
    setTitle: (value: string) => setTitle(value.slice(0, INQUIRY_TITLE_MAX_LENGTH)),
    content,
    setContent: (value: string) => setContent(value.slice(0, INQUIRY_CONTENT_MAX_LENGTH)),
    canSubmit,
    isSubmitting,
    submit,
  };
}
