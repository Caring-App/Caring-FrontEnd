import React from 'react';
import { Pressable, View } from 'react-native';
import MinusIcon from '@assets/icons/action/minus.svg';
import PlusIcon from '@assets/icons/action/plus.svg';
import { useSliderDrag } from '../model';

const TTS_SPEED_STEP = 10;
const TTS_THUMB_RADIUS = 8; // 동그라미가 -/+ 아이콘에 닿지 않도록 트랙 양 끝에 둘 여백(px)

export function TtsSpeedSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const clamp = (next: number) => Math.min(100, Math.max(0, next));
  const { trackRef, panHandlers, onTrackLayout, thumbPositionPercent } = useSliderDrag({
    value,
    onChange,
    thumbRadius: TTS_THUMB_RADIUS,
  });

  return (
    // "+"(14x14, 꽉 찬 모양)가 "−"(14x2, 얇은 선)보다 시각적으로 커 보여서 같은 여백이어도
    // 오른쪽이 더 남아 보이는 착시가 있어, 양쪽 여백을 다르게 줌(트랙-동그라미 계산은 대칭).
    <View className="w-[180px] flex-row items-center">
      <Pressable onPress={() => onChange(clamp(value - TTS_SPEED_STEP))} hitSlop={8} className="mr-2">
        <MinusIcon width={14} height={2} />
      </Pressable>
      <View
        ref={trackRef}
        {...panHandlers}
        hitSlop={{ top: 12, bottom: 12 }}
        className="relative h-1 flex-1 rounded-full bg-border"
        onLayout={onTrackLayout}>
        <View
          className="absolute h-4 w-4 rounded-full bg-text-strong"
          style={{ left: `${thumbPositionPercent}%`, top: '50%', marginLeft: -8, marginTop: -8 }}
        />
      </View>
      <Pressable onPress={() => onChange(clamp(value + TTS_SPEED_STEP))} hitSlop={8} className="ml-1">
        <PlusIcon width={14} height={14} />
      </Pressable>
    </View>
  );
}
