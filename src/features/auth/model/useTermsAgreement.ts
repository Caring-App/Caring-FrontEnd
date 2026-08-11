import { useState } from 'react';

export interface TermItem {
  id: string;
  title: string;
  required: boolean;
}

export const TERM_LIST: TermItem[] = [
  { id: 'service', title: '서비스 이용약관 동의', required: true },
  { id: 'privacy', title: '개인정보 수집 및 이용 동의', required: true },
  { id: 'location', title: '위치기반 서비스 이용약관 동의', required: true },
  { id: 'thirdParty', title: '개인정보 제3자 제공 동의', required: true },
  { id: 'marketing', title: '마케팅 정보 수신 동의', required: false },
  { id: 'optionalPrivacy', title: '개인정보 선택 수집 동의', required: false },
  { id: 'voice', title: '음성 데이터 수집 및 이용 동의', required: false },
];

// 돌봄대상자 약관 목록 — 보호자 목록과 동일하나 "음성 데이터 수집 및 이용 동의" 항목만 없음 (Figma 151:12313)
export const WARD_TERM_LIST: TermItem[] = TERM_LIST.filter((term) => term.id !== 'voice');

export const useTermsAgreement = (termList: TermItem[] = TERM_LIST) => {
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
