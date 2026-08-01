import React from 'react';
import { Pressable, Text, View } from 'react-native';
import EditPencilIcon from '@assets/icons/action/edit-pencil.svg';
import { FontSizeOption, Ward } from '../model';
import { TtsSpeedSlider } from './TtsSpeedSlider';
import { FontSizeSegmentedControl } from './FontSizeSegmentedControl';

export function WardCard({
  ward,
  onChangeTtsSpeed,
  onChangeFontSize,
  onPressEdit,
}: {
  ward: Ward;
  onChangeTtsSpeed: (speed: number) => void;
  onChangeFontSize: (size: FontSizeOption) => void;
  onPressEdit: () => void;
}) {
  return (
    <View className="relative rounded-card border border-border bg-surface p-4">
      <Text className="text-xl font-pretendard-bold text-text-primary">{ward.nickname}</Text>
      <Pressable onPress={onPressEdit} hitSlop={8} className="absolute right-4 top-4">
        <EditPencilIcon width={22} height={22} />
      </Pressable>

      <View className="mt-3 gap-1.5">
        <Text className="text-md font-pretendard-semibold text-text-primary">이름 : {ward.name}</Text>
        <Text className="text-md font-pretendard-semibold text-text-primary">
          전화번호 : {ward.phone}
        </Text>
        <Text className="text-md font-pretendard-semibold text-text-primary">주소 : {ward.address}</Text>
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-md font-pretendard-semibold text-text-primary">음성 알림 속도 설정</Text>
        <TtsSpeedSlider value={ward.ttsSpeed} onChange={onChangeTtsSpeed} />
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <Text className="text-md font-pretendard-semibold text-text-primary">글자 크기 설정</Text>
        <FontSizeSegmentedControl value={ward.fontSize} onChange={onChangeFontSize} />
      </View>
    </View>
  );
}
