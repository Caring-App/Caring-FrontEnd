import { FaqItem, PolicyItem, ProfileInfo, WithdrawReasonOption } from './types';

export const MOCK_PROFILE: ProfileInfo = {
  name: '이세연님',
  phone: '',
  address: '',
};

export const MOCK_LINK_CODE = 'ABC123-DFG456';

export const MOCK_FAQS: FaqItem[] = [
  {
    id: '1',
    category: '고객센터',
    question: '고객센터 운영시간이 어떻게 되나요?',
    answer: '평일 08:00 ~ 17:00 (주말 및 공휴일 휴무), 점심시간 12:00 ~ 13:00 입니다.',
  },
  {
    id: '2',
    category: '회원',
    question: '회원 탈퇴 후 재가입할 수 있나요?',
    answer:
      '탈퇴 후 30일(또는 서비스 운영 정책에 따른 기간) 동안은 동일한 아이디 또는 휴대전화로 재가입이 제한될 수 있습니다.',
  },
  {
    id: '3',
    category: '회원',
    question: '휴대폰 번호 변경 시 어떻게 수정하나요?',
    answer: '마이페이지 > 개인 정보 수정에서 전화번호를 변경할 수 있습니다.',
  },
  {
    id: '4',
    category: '개인정보',
    question: '위치 정보 수집을 거부하면 서비스를 이용할 수 없나요?',
    answer: '위치 기반 서비스와 관련된 일부 기능의 이용이 제한될 수 있습니다.',
  },
  {
    id: '5',
    category: '서비스 이용',
    question: '보호자 한 명이 여러 명의 어르신을 등록할 수 있나요?',
    answer: '네, 돌봄대상자 관리 화면에서 여러 명의 어르신을 등록하고 관리할 수 있습니다.',
  },
  {
    id: '6',
    category: '서비스 이용',
    question: '복약 알림 시간은 어떻게 설정하나요?',
    answer: '복약 관리 화면에서 어르신별로 알림 시간을 직접 설정할 수 있습니다.',
  },
];

export const MOCK_POLICIES: PolicyItem[] = [
  { id: '1', title: '일정 및 복약 관리 정책' },
  { id: '2', title: '법적 이슈 및 개인정보 보호' },
  { id: '3', title: 'API 및 시스템 장애 대응 정책' },
  { id: '4', title: '기타 운영 정책' },
];

export const WITHDRAW_REASONS: WithdrawReasonOption[] = [
  { id: 'low-usage', label: '이용 빈도 낮음' },
  { id: 'rejoin', label: '재가입' },
  { id: 'dissatisfaction', label: '서비스 불만' },
  { id: 'support', label: '고객 응대 불만' },
  { id: 'privacy', label: '개인 정보 유출 우려' },
  { id: 'etc', label: '기타' },
];
