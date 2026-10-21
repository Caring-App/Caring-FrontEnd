import React, { useRef } from 'react';
import { Pressable, View } from 'react-native';
import MinusIcon from '@assets/icons/action/minus.svg';
import PlusIcon from '@assets/icons/action/plus.svg';
import { useSliderDrag } from '../model';

// 백엔드 ttsRate 유효값: 0.5 / 0.75 / 1.0 / 1.25 / 1.5 다섯 단계만 허용
const TTS_RATE_MIN = 0.5;
const TTS_RATE_MAX = 1.5;
const TTS_RATE_STEP = 0.25;
const TTS_THUMB_RADIUS = 8; // 동그라미가 -/+ 아이콘에 닿지 않도록 트랙 양 끝에 둘 여백(px)

export function TtsSpeedSlider({
  value,
  onChange,
  onChangeCommit,
}: {
  value: number;
  onChange: (value: number) => void;
  // 드래그 중엔 화면만 즉시 갱신하고, 손을 뗐을 때/버튼 탭했을 때만 호출됨(저장용 — API 스팸 방지)
  onChangeCommit: (value: number) => void;
}) {
  // 백엔드에서 아직 설정이 없는 어르신은 null이거나 유효 범위 밖의 값(예: 0.1)이 내려올 수 있어서,
  // 동그라미가 트랙 밖으로 튀어나가거나 화면이 죽지 않도록 방어적으로 범위를 잘라줌
  const clamp = (next: number | null | undefined) => {
    const safe = typeof next === 'number' && !Number.isNaN(next) ? next : TTS_RATE_MIN;
    return Math.min(TTS_RATE_MAX, Math.max(TTS_RATE_MIN, Number(safe.toFixed(2))));
  };
  const { trackRef, panHandlers, onTrackLayout, thumbLeftPx } = useSliderDrag({
    value: clamp(value),
    min: TTS_RATE_MIN,
    max: TTS_RATE_MAX,
    step: TTS_RATE_STEP,
    onChange,
    onChangeEnd: onChangeCommit,
    thumbRadius: TTS_THUMB_RADIUS,
  });

  // "+"/"-"를 빠르게 연타하면 리액트가 value prop을 아직 최신으로 리렌더하기 전에 다음 탭이 들어올 수 있어서,
  // 그럴 때마다 이 ref로 직접 최신값을 들고 있다가 다음 탭 계산에 씀(안 그러면 여러 번 눌러도
  // 오래된 값 기준으로 매번 같은 다음 값이 나와서 최댓값까지 못 가고 중간에 멈출 수 있음)
  const latestValueRef = useRef(value);
  latestValueRef.current = value;

  const step = (delta: number) => {
    const next = clamp(latestValueRef.current + delta);
    latestValueRef.current = next;
    onChange(next);
    onChangeCommit(next);
  };

  return (
    // 동그라미는 트랙 안쪽으로 thumbRadius(8px)만큼만 여백을 두고 양 끝까지 움직이므로,
    // -/+ 아이콘과의 여백(mr/ml)도 동일하게 맞춰야 양쪽 끝에서 똑같이 끝까지 도달한 것처럼 보임
    // (예전엔 "+" 아이콘이 시각적으로 더 커 보이는 착시를 보정하려고 ml을 더 작게 줬었는데,
    // 그 결과 최댓값에서 트랙 끝까지는 가도 아이콘까지의 여백이 반대쪽보다 좁아 보여 다시 맞춤).
    <View className="w-[180px] flex-row items-center">
      <Pressable onPress={() => step(-TTS_RATE_STEP)} hitSlop={8} className="mr-2">
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
          style={{ left: thumbLeftPx, top: '50%', marginTop: -8 }}
        />
      </View>
      <Pressable onPress={() => step(TTS_RATE_STEP)} hitSlop={8} className="ml-2">
        <PlusIcon width={14} height={14} />
      </Pressable>
    </View>
  );
}
