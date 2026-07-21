import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { MOCK_WARD_LOCATION } from '@features/location/model';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';

export function MapScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={18} height={18} />
        </Pressable>
        <Text className="text-md font-bold text-text-primary">위치 GPS</Text>
      </View>

      <NaverMapView
        style={{ flex: 1 }}
        initialCamera={{
          latitude: MOCK_WARD_LOCATION.latitude,
          longitude: MOCK_WARD_LOCATION.longitude,
          zoom: 16,
        }}>
        <NaverMapMarkerOverlay
          latitude={MOCK_WARD_LOCATION.latitude}
          longitude={MOCK_WARD_LOCATION.longitude}
        />
      </NaverMapView>
    </SafeAreaView>
  );
}
