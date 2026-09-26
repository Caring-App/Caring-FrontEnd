import React from 'react';
import { Pressable, Text, View } from 'react-native';
import PinAngleFillIcon from '@assets/icons/section/pin-angle-fill.svg';
import { WelfareFacility } from '../model';
import { formatDistance } from '../utils';
import { DetailLinkText } from './DetailLinkText';

export function WelfareFacilityListItem({
  facility,
  onPressDetail,
}: {
  facility: WelfareFacility;
  onPressDetail: () => void;
}) {
  return (
    <Pressable onPress={onPressDetail} className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <PinAngleFillIcon width={16} height={16} />
        <Text className="flex-1 text-xl font-pretendard-semibold text-text-primary" numberOfLines={1}>
          {facility.name}
        </Text>
        <Text className="text-[12px] font-pretendard-semibold text-primary">{formatDistance(facility.distanceKm)}</Text>
      </View>
      {facility.operator && (
        <Text className="mt-2 text-[12px] font-pretendard-semibold text-text-primary">운영 : {facility.operator}</Text>
      )}
      {facility.address && (
        <Text className="mt-1 text-[12px] font-pretendard-medium text-text-muted" numberOfLines={1}>
          {facility.address}
        </Text>
      )}
      <View className="mt-3 flex-row justify-end">
        <DetailLinkText onPress={onPressDetail} />
      </View>
    </Pressable>
  );
}
