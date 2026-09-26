import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { colors } from '@shared/theme/colors';
import { WELFARE_SEARCH_RADIUS_KM, WelfareFacility, useNearbyWelfareFacilities } from '../model';
import { WelfareFacilityListItem } from './WelfareFacilityListItem';

interface NearbyWelfareFacilityListProps {
  wardId: string;
  onPressFacility: (facility: WelfareFacility) => void;
}

// 주변 공공 복지 시설 목록 본문. 조회 중/실패/결과 없음/목록 네 가지 상태를 여기서 처리해서
// 화면(WelfareFacilityListScreen)은 헤더와 조합만 담당하게 함.
export function NearbyWelfareFacilityList({ wardId, onPressFacility }: NearbyWelfareFacilityListProps) {
  const { facilities, isLoading, errorMessage, refetch } = useNearbyWelfareFacilities(wardId);

  if (errorMessage) {
    return (
      <View className="flex-1 items-center justify-center gap-4 px-8">
        <Text className="text-center text-md font-pretendard-medium text-text-muted">{errorMessage}</Text>
        <Pressable onPress={refetch} className="rounded-card bg-primary px-6 py-3">
          <Text className="text-md font-pretendard-semibold text-surface">다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  // 처음 조회하는 지역은 백엔드가 공공데이터를 새로 받아와서 수 초 걸릴 수 있어 안내 문구를 같이 보여줌
  if (isLoading || !facilities) {
    return (
      <View className="flex-1 items-center justify-center gap-3">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-md font-pretendard-medium text-text-muted">주변 시설을 찾고 있어요</Text>
      </View>
    );
  }

  if (facilities.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-md font-pretendard-medium text-text-muted">
          반경 {WELFARE_SEARCH_RADIUS_KM}km 안에 공공 복지 시설이 없어요.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 px-4" contentContainerClassName="gap-4 pb-8" showsVerticalScrollIndicator={false}>
      {facilities.map(facility => (
        <WelfareFacilityListItem key={facility.id} facility={facility} onPressDetail={() => onPressFacility(facility)} />
      ))}
    </ScrollView>
  );
}
