import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { GuardianStackParamList } from '@app/navigation/types';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import PaginationDotsIcon from '@assets/icons/section/pagination-dots.svg';
import { MOCK_WELFARE_FACILITIES } from '@features/welfare-facility/model';

type WelfareFacilityDetailRouteProp = RouteProp<GuardianStackParamList, 'WelfareFacilityDetail'>;

export function WelfareFacilityDetailScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<WelfareFacilityDetailRouteProp>();
  const facility = MOCK_WELFARE_FACILITIES.find(item => item.id === params.facilityId);

  if (!facility) return null;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-bold text-text-primary">{facility.name}</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        {facility.posterImage && (
          <View className="mt-4 items-center">
            <Image
              source={facility.posterImage}
              className="h-[360px] w-full rounded-card border border-border"
              resizeMode="cover"
            />
            <View className="mt-3">
              <PaginationDotsIcon width={53} height={11} />
            </View>
          </View>
        )}

        <View className="mt-4 gap-1.5 border-t border-border pt-4">
          <Text className="text-md font-pretendard-semibold text-text-primary">
            문의 전화번호 : {facility.phone}
          </Text>
          <Text className="text-md font-pretendard-semibold text-text-primary">
            주소 : {facility.address}
          </Text>
          <Text className="text-md font-pretendard-semibold text-text-primary">
            운영 시간 : {facility.hours}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
