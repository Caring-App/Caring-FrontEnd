import React from 'react';
import { Text, View } from 'react-native';

// 문의 답변 상태 — 답변완료(주황) / 답변대기(회색)
export function InquiryStatusBadge({ answered }: { answered: boolean }) {
  return (
    <View className={`rounded-full px-2 py-0.5 ${answered ? 'bg-primary-50' : 'bg-surface-subtle'}`}>
      <Text className={`text-2xs font-pretendard-semibold ${answered ? 'text-primary' : 'text-text-muted'}`}>
        {answered ? '답변완료' : '답변대기'}
      </Text>
    </View>
  );
}
