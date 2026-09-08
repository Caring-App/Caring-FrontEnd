export interface ProfileInfo {
  name: string;
  phone: string;
  address: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface WithdrawReasonOption {
  id: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  sender: 'system' | 'user';
  text: string;
}
