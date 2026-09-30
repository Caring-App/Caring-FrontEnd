import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import CrosshairIcon from '@assets/icons/action/crosshair.svg';
import { useSelectedWardStore } from '@features/ward-management/model';
import { WELFARE_SEARCH_RADIUS_KM } from '@features/welfare-facility/model';
import { NearbyWelfareFacilityList } from '@features/welfare-facility/ui';
import { NoLinkedWardNotice } from '@features/ward-management/ui';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function WelfareFacilityListScreen() {
  const navigation = useNavigation<GuardianStackNavigationProp>();
  const selectedWardId = useSelectedWardStore(state => state.selectedWardId);
  const wards = useSelectedWardStore(state => state.wards);
  const ward = wards.find(item => item.id === selectedWardId) ?? wards[0];

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-bold text-text-primary">주변 공공 복지 시설</Text>
      </View>

      {ward ? (
        <>
          {/* 백엔드가 기기 GPS가 아니라 어르신 회원 정보에 등록된 주소 기준으로 찾아주므로 그 기준을 안내함
              (등록 주소 변경은 돌봄대상자 관리 화면에서) */}
          <View className="flex-row items-center gap-2 px-4 py-3">
            <CrosshairIcon width={16} height={16} />
            <Text className="text-md font-pretendard-bold text-text-primary">
              {ward.nickname}님 등록 주소 기준 반경 {WELFARE_SEARCH_RADIUS_KM}km
            </Text>
          </View>

          <NearbyWelfareFacilityList
            wardId={ward.id}
            onPressFacility={facility => navigation.navigate('WelfareFacilityDetail', { facility })}
          />
        </>
      ) : (
        <View className="px-4 pt-4">
          <NoLinkedWardNotice />
        </View>
      )}
    </SafeAreaView>
  );
}
