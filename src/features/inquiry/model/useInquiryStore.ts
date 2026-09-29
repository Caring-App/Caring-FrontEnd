import { create } from 'zustand';
import { getApiErrorMessage, logApiError } from '@shared/api';
import { notifyLoadFailed, showNotice } from '@shared/model';
import { resetOnLogout } from '@shared/store/resetOnLogout';
import { answerInquiryApi, createInquiryApi, getInquiryApi, getMyInquiriesApi } from '../api';
import { Inquiry } from './types';

interface InquiryState {
  inquiries: Inquiry[];
  // 상세 화면에서 불러온 문의(목록에 없는 id를 관리자가 여는 경우도 있어 따로 보관)
  inquiryById: Record<number, Inquiry>;
  isLoading: boolean;
  hasLoaded: boolean;
  fetchInquiries: () => Promise<void>;
  fetchInquiry: (inquiryId: number) => Promise<void>;
  // 성공하면 true — 실패 사유는 안내 모달로 알림
  createInquiry: (title: string, content: string) => Promise<boolean>;
  answerInquiry: (inquiryId: number, answer: string) => Promise<boolean>;
}

export const useInquiryStore = create<InquiryState>((set, get) => ({
  inquiries: [],
  inquiryById: {},
  isLoading: false,
  hasLoaded: false,

  fetchInquiries: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      set({ inquiries: await getMyInquiriesApi(), hasLoaded: true });
    } catch (error) {
      logApiError('내 문의 목록 조회 실패', error);
      notifyLoadFailed();
    } finally {
      set({ isLoading: false });
    }
  },

  fetchInquiry: async inquiryId => {
    try {
      const inquiry = await getInquiryApi(inquiryId);
      set(state => ({ inquiryById: { ...state.inquiryById, [inquiryId]: inquiry } }));
    } catch (error) {
      logApiError('문의 상세 조회 실패', error);
      notifyLoadFailed();
    }
  },

  createInquiry: async (title, content) => {
    try {
      await createInquiryApi({ title, content });
      await get().fetchInquiries();
      return true;
    } catch (error) {
      logApiError('문의 작성 실패', error);
      showNotice('문의를 등록하지 못했어요', getApiErrorMessage(error) ?? '잠시 후 다시 시도해 주세요.');
      return false;
    }
  },

  answerInquiry: async (inquiryId, answer) => {
    try {
      await answerInquiryApi(inquiryId, { answer });
      // 답변 시각·상태는 서버 값으로 맞추기 위해 다시 조회
      await Promise.all([get().fetchInquiry(inquiryId), get().fetchInquiries()]);
      return true;
    } catch (error) {
      logApiError('문의 답변 등록 실패', error);
      showNotice('답변을 등록하지 못했어요', getApiErrorMessage(error) ?? '잠시 후 다시 시도해 주세요.');
      return false;
    }
  },
}));

resetOnLogout(useInquiryStore);
