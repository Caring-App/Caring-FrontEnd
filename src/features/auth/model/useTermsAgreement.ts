import { useState } from 'react';

export interface TermItem {
  id: string;
  title: string;
  required: boolean;
}

// 회원가입 약관 목록 (Figma 966:5711) — 보호자/돌봄대상자 공용
export const TERM_LIST: TermItem[] = [
  { id: 'service', title: '케어링 이용자용 이용약관', required: true },
  { id: 'privacy', title: '개인정보 수집 및 이용 동의', required: true },
  { id: 'marketingPrivacy', title: '마케팅 개인정보 수집 및 이용 동의', required: false },
  { id: 'marketing', title: '마케팅 정보 수신동의', required: false },
];

// termList는 호출부가 쓸 약관 목록을 명시적으로 넘기도록 필수 파라미터로 둠
export const useTermsAgreement = (termList: TermItem[]) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const isAllChecked = termList.every((item) => checkedItems[item.id]);
  const isRequiredChecked = termList
    .filter((item) => item.required)
    .every((item) => checkedItems[item.id]);

  const handleCheckItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCheckAll = () => {
    const nextValue = !isAllChecked;
    const newCheckedItems: { [key: string]: boolean } = {};
    termList.forEach((item) => {
      newCheckedItems[item.id] = nextValue;
    });
    setCheckedItems(newCheckedItems);
  };

  return {
    checkedItems,
    isAllChecked,
    isRequiredChecked,
    handleCheckItem,
    handleCheckAll,
  };
};
