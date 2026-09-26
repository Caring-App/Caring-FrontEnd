import React from 'react';
import { Pressable, Text } from 'react-native';

interface FacilityInfoRowProps {
  label: string;
  value: string;
  // 있으면 값을 링크처럼 밑줄 표시하고 누를 수 있게 함(전화번호/홈페이지)
  onPress?: () => void;
}

// 복지 시설 상세 화면의 "라벨 : 값" 한 줄
export function FacilityInfoRow({ label, value, onPress }: FacilityInfoRowProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} hitSlop={4}>
      <Text className="text-md font-pretendard-semibold text-text-primary">
        {label} : <Text className={onPress ? 'text-text-link underline' : undefined}>{value}</Text>
      </Text>
    </Pressable>
  );
}
