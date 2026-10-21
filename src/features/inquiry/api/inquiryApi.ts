import { axiosInstance } from '@shared/api/axiosInstance';
import { Inquiry, InquiryAnswerRequest, InquiryCreateRequest } from '../model/types';

// [문의 작성] — 만들어진 문의 id를 돌려줌
export const createInquiryApi = async (payload: InquiryCreateRequest): Promise<number> => {
  const { data } = await axiosInstance.post<number>('/api/inquiries', payload);
  return data;
};

// [내 문의 목록] — 최신순
export const getMyInquiriesApi = async (): Promise<Inquiry[]> => {
  const { data } = await axiosInstance.get<Inquiry[]>('/api/inquiries/me');
  return data ?? [];
};

// [문의 상세] — 작성자 본인이나 관리자만 조회 가능
export const getInquiryApi = async (inquiryId: number): Promise<Inquiry> => {
  const { data } = await axiosInstance.get<Inquiry>(`/api/inquiries/${inquiryId}`);
  return data;
};

// [답변 등록] — 관리자 전용
export const answerInquiryApi = async (inquiryId: number, payload: InquiryAnswerRequest): Promise<void> => {
  await axiosInstance.patch(`/api/inquiries/${inquiryId}/answer`, payload);
};
