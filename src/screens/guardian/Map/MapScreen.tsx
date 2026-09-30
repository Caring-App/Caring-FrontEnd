import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { useWardLocation } from '@features/location/model';
import { useSelectedWardStore } from '@features/ward-management/model';
import { NoLinkedWardNotice } from '@features/ward-management/ui';
import { colors } from '@shared/theme/colors';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';

export function MapScreen() {
  const navigation = useNavigation();
  const selectedWardId = useSelectedWardStore(state => state.selectedWardId);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={18} height={18} />
        </Pressable>
        <Text className="text-md font-bold text-text-primary">위치 GPS</Text>
      </View>

      {selectedWardId ? (
        <WardLocationMap wardId={selectedWardId} />
      ) : (
        <View className="px-4 pt-4">
          <NoLinkedWardNotice />
        </View>
      )}
    </SafeAreaView>
  );
}

// 연동된 어르신이 있을 때만 그림 — 빈 id로 위치를 조회하지 않게(Number('')는 0이라 0번 어르신을 조회하게 됨)
function WardLocationMap({ wardId }: { wardId: string }) {
  const location = useWardLocation(wardId);

  return location ? (
    <NaverMapView
      key={wardId}
      style={{ flex: 1 }}
      initialCamera={{
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 16,
      }}>
      <NaverMapMarkerOverlay latitude={location.latitude} longitude={location.longitude} />
    </NaverMapView>
  ) : (
    // 좌표가 준비되기 전엔 NaverMapView에 넘길 값이 없어 렌더링하지 않음(LocationSection과 동일한 이유).
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="small" color={colors.primary} />
    </View>
  );
}
