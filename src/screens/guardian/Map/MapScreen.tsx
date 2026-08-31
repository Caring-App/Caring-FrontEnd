import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { useWardLocationStore } from '@features/location/model';
import { useSelectedWardStore } from '@features/ward-management/model';
import { colors } from '@shared/theme/colors';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';

export function MapScreen() {
  const navigation = useNavigation();
  const selectedWardId = useSelectedWardStore(state => state.selectedWardId);
  const wardIdNumber = Number(selectedWardId);
  const location = useWardLocationStore(state => state.locationsByWard[wardIdNumber]);
  const fetchLocation = useWardLocationStore(state => state.fetchLocation);

  useEffect(() => {
    if (!Number.isNaN(wardIdNumber)) {
      fetchLocation(wardIdNumber);
    }
  }, [wardIdNumber, fetchLocation]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={18} height={18} />
        </Pressable>
        <Text className="text-md font-bold text-text-primary">위치 GPS</Text>
      </View>

      {location ? (
        <NaverMapView
          key={selectedWardId}
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
      )}
    </SafeAreaView>
  );
}
