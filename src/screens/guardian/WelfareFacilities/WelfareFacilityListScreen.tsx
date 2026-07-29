import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import CrosshairIcon from '@assets/icons/action/crosshair.svg';
import PencilSquareIcon from '@assets/icons/action/pencil-square.svg';
import { MOCK_WELFARE_FACILITIES } from '@features/welfare-facility/model';
import { WelfareFacilityListItem } from '@features/welfare-facility/ui';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function WelfareFacilityListScreen() {
  const navigation = useNavigation<GuardianStackNavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-bold text-text-primary">주변 공공 복지 시설</Text>
      </View>

      <View className="flex-row items-center gap-2 px-4 py-3">
        <CrosshairIcon width={16} height={16} />
        <Text className="text-md font-pretendard-bold text-text-primary">
          위치 : 서울시 구로구 고척동
        </Text>
        {/* TODO: 실제 위치 수정 기능 연동 전까지는 표시만 함 */}
        <Pressable hitSlop={8}>
          <PencilSquareIcon width={14} height={14} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-4 pb-8"
        showsVerticalScrollIndicator={false}>
        {MOCK_WELFARE_FACILITIES.map(facility => (
          <WelfareFacilityListItem
            key={facility.id}
            facility={facility}
            onPressDetail={() =>
              navigation.navigate('WelfareFacilityDetail', { facilityId: facility.id })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
