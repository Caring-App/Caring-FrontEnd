import React from 'react';
import { Pressable, Text, View } from 'react-native';
import PinAngleFillIcon from '@assets/icons/section/pin-angle-fill.svg';
import { WelfareFacility } from '../model';
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
        <Text className="text-xl font-pretendard-semibold text-text-primary">{facility.name}</Text>
      </View>
      <Text className="mt-2 text-[12px] font-pretendard-semibold text-text-primary">
        혜택 : {facility.benefit}
      </Text>
      <View className="mt-3 flex-row justify-end">
        <DetailLinkText onPress={onPressDetail} />
      </View>
    </Pressable>
  );
}
