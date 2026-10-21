import React from 'react';
import { Pressable, Text, View } from 'react-native';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { Inquiry } from '../model';
import { formatInquiryDate } from '../utils';
import { InquiryStatusBadge } from './InquiryStatusBadge';

// 문의 게시판 목록 한 줄 — 상태, 제목, 작성일
export function InquiryListItem({ inquiry, onPress }: { inquiry: Inquiry; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 border-b border-border-divider py-4">
      <View className="flex-1 gap-1.5">
        <View className="flex-row items-center gap-2">
          <InquiryStatusBadge answered={inquiry.answered} />
          <Text className="text-xs font-pretendard-medium text-text-muted">{formatInquiryDate(inquiry.createdAt)}</Text>
        </View>
        <Text className="text-md font-pretendard-semibold text-text-primary" numberOfLines={1}>
          {inquiry.title}
        </Text>
      </View>
      <ChevronRightIcon width={16} height={16} />
    </Pressable>
  );
}
