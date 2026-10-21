import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { useWardLocation } from '@features/location/model';
import { SectionCard } from '@shared/ui';
import { colors } from '@shared/theme/colors';
import GeoAltFillIcon from '@assets/icons/section/geo-alt-fill.svg';

export function LocationSection({ wardId, onPressMore }: { wardId: string; onPressMore?: () => void }) {
  const location = useWardLocation(wardId);

  return (
    <SectionCard title="위치 GPS" icon={<GeoAltFillIcon width={15} height={20} />} className="">
      <View className="relative mt-3 h-[200px] overflow-hidden rounded-card border border-border">
        {location ? (
          <>
            <NaverMapView
              key={wardId}
              style={{ height: 200 }}
              initialCamera={{
                latitude: location.latitude,
                longitude: location.longitude,
                zoom: 15,
              }}
              isScrollGesturesEnabled={false}
              isZoomGesturesEnabled={false}
              isTiltGesturesEnabled={false}
              isRotateGesturesEnabled={false}
              isStopGesturesEnabled={false}
              isShowLocationButton={false}>
              <NaverMapMarkerOverlay latitude={location.latitude} longitude={location.longitude} />
            </NaverMapView>
            <Pressable onPress={onPressMore} className="absolute inset-0" />
          </>
        ) : (
          // 위치를 아직 못 받아온 상태(로딩 중이거나 어르신 기기가 아직 위치를 한 번도 보고하지 않음)에서
          // NaverMapView에 좌표를 못 넘긴 채로 렌더링하면 네이티브 크래시가 났던 이력이 있어(실기기 확인함)
          // 좌표가 준비되기 전엔 지도를 아예 렌더링하지 않음.
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </View>
    </SectionCard>
  );
}
