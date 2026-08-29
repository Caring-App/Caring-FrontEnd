import React from 'react';
import { Pressable, View } from 'react-native';
import ClipboardPulseIcon from '@assets/icons/section/clipboard-pulse.svg';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 어르신 글자 크기 배율은
// ward-management가 유일한 소스라(useWardFontScaleStore) 이 화면에서도 WardText를 그대로 가져다 씀
// (순환참조 없음, ward-management는 health를 참조하지 않음).
import { WardText } from '@features/ward-management/ui';
import { useHealthStatusStore } from '../model';
import { HealthStatusEmojiButton } from './HealthStatusEmojiButton';

interface WardHealthStatusCardProps {
  wardId: string;
  onPressRecord: () => void;
}

// 돌봄대상자 메인 화면의 "오늘의 건강 상태" 카드. 어르신이 직접 눌러서 오늘 상태를 기록하면
// useHealthStatusStore를 통해 보호자 화면(DailyReportCard)에 그대로 반영됨.
// "오늘의 건강 기록하기" 버튼도 같은 섹션에 속해 있어서 이 카드 안에 같이 둠(Figma 기준)
export function WardHealthStatusCard({ wardId, onPressRecord }: WardHealthStatusCardProps) {
  const status = useHealthStatusStore(state => state.statusByWard[wardId]);

  return (
    <View className="rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <ClipboardPulseIcon width={21} height={21} />
        <WardText size="xl" className="font-pretendard-bold text-text-primary">
          오늘의 건강 상태
        </WardText>
      </View>

      <View className="mt-4 rounded-card border border-border bg-surface p-4">
        <View className="flex-row justify-around">
          <HealthStatusEmojiButton
            status="good"
            active={status === 'good'}
            onPress={() => useHealthStatusStore.getState().setStatus(wardId, 'good')}
          />
          <HealthStatusEmojiButton
            status="normal"
            active={status === 'normal'}
            onPress={() => useHealthStatusStore.getState().setStatus(wardId, 'normal')}
          />
          <HealthStatusEmojiButton
            status="bad"
            active={status === 'bad'}
            onPress={() => useHealthStatusStore.getState().setStatus(wardId, 'bad')}
          />
        </View>
      </View>

      <Pressable onPress={onPressRecord} className="mt-4 items-center justify-center rounded-card bg-primary py-4">
        <WardText size="xl" className="font-pretendard-semibold text-white">
          오늘의 건강 기록하기
        </WardText>
      </Pressable>
    </View>
  );
}
