import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@shared/theme/colors';
import CheckIcon from '@assets/icons/auth/check.svg';
import TermChevronRightIcon from '@assets/icons/auth/term-chevron-right.svg';

interface TermAgreeAllButtonProps {
  checked: boolean;
  onPress: () => void;
}

// 약관 동의 화면 "전체 동의" 카드 (Figma 966:5777) — 선택 시 주황 원 + 흰 체크
export function TermAgreeAllButton({ checked, onPress }: TermAgreeAllButtonProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center gap-4 rounded-2xl border-[0.8px] border-border-signupCard bg-surface px-5 py-4"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        className={`h-[26px] w-[26px] items-center justify-center rounded-full ${
          checked ? 'bg-primary' : 'border-[0.8px] border-border-signupCard bg-surface'
        }`}
      >
        {checked && <CheckIcon width={16} height={12} color={colors.surface} />}
      </View>
      <Text className="font-pretendard-medium text-[17px] leading-[25.5px] text-text-signupTitle">전체 동의</Text>
    </TouchableOpacity>
  );
}

interface TermRowProps {
  title: string;
  required: boolean;
  checked: boolean;
  onPress: () => void;
}

// 약관 개별 항목 (Figma 966:5731) — 체크(미선택 회색/선택 주황) + 제목 + 우측 화살표
export function TermRow({ title, required, checked, onPress }: TermRowProps) {
  return (
    <TouchableOpacity className="flex-row items-center justify-between py-2" onPress={onPress} activeOpacity={0.7}>
      <View className="flex-1 flex-row items-center gap-3">
        <CheckIcon width={16} height={12} color={checked ? colors.primary : colors.textSignupPlaceholder} />
        <Text className="shrink font-pretendard text-base leading-[21px] text-text-termItem">
          {title} [{required ? '필수' : '선택'}]
        </Text>
      </View>
      <TermChevronRightIcon width={8} height={14} />
    </TouchableOpacity>
  );
}
