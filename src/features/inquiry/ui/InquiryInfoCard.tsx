import React from 'react';
import { Text, View } from 'react-native';

// 문의 게시판 상단 고객센터 안내 — 운영시간·전화 문의(기존 문의하기 화면 내용 유지)
export function InquiryInfoCard() {
  return (
    <View className="gap-3">
      <View className="gap-1 rounded-card border border-border p-3">
        <Text className="text-md font-pretendard-bold text-text-heading">※앱 관련 문의 운영시간 안내</Text>
        <Text className="text-md font-pretendard-medium text-text-muted">월-금 08:00 ~ 17:00 (주말 및 공휴일 휴무)</Text>
        <Text className="text-md font-pretendard-medium text-text-muted">점심시간 12:00 ~ 13:00</Text>
      </View>
      <View className="flex-row gap-3">
        <View className="flex-1 items-center gap-2 rounded-card border border-border py-4">
          <Text className="text-md font-pretendard-bold text-text-heading">일반 문의</Text>
          <Text className="text-lg font-pretendard-bold text-text-primary">(4321-1234)</Text>
        </View>
        <View className="flex-1 items-center gap-2 rounded-card border border-border py-4">
          <Text className="text-md font-pretendard-bold text-text-heading">앱 관련 문의</Text>
          <Text className="text-lg font-pretendard-bold text-text-primary">(1234-4321)</Text>
        </View>
      </View>
    </View>
  );
}
