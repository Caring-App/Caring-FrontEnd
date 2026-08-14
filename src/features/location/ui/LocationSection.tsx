import React from 'react';
import { Pressable, View } from 'react-native';
import { NaverMapView, NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import { getWardLocation } from '@features/location/model';
import { SectionCard } from '@shared/ui';
import GeoAltFillIcon from '@assets/icons/section/geo-alt-fill.svg';

export function LocationSection({ wardId, onPressMore }: { wardId: string; onPressMore?: () => void }) {
  const location = getWardLocation(wardId);

  return (
    <SectionCard title="위치 GPS" icon={<GeoAltFillIcon width={15} height={20} />} className="">
      <View className="relative mt-3 overflow-hidden rounded-card border border-border">
        <NaverMapView
          key={wardId}
          style={{ height: 160 }}
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
      </View>
    </SectionCard>
  );
}
