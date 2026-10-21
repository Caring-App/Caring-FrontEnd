import { useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, View } from 'react-native';

// 트랙을 손가락으로 눌러/드래그해서 [min, max] 범위의 값을 step 단위로 스냅해 정하는 로직.
// onChange는 드래그 중 계속(화면에 즉시 반영용), onChangeEnd는 손을 뗀 시점 한 번만(저장용) 호출됨.
//
// 이동량 계산은 절대 화면좌표(pageX + View.measure())가 아니라 제스처 시작점 대비 상대 이동량
// (gestureState.dx)만 사용함 — measure()는 레이아웃 직후 호출되면 오래된 좌표를 반환하는 경우가
// 있어서(RN에서 잘 알려진 문제) 트랙 끝까지 드래그해도 실제로는 끝값에 못 미치는 버그가 있었음.
//
// 동그라미 위치도 "%"가 아니라 트랙 실측 너비(px, onLayout) 기준 픽셀 좌표로 직접 계산해서 반환함 —
// 버튼(+/-)으로 정확히 max/min에 도달해도 동그라미가 끝까지 안 가는 것처럼 보이는 버그가 있었는데,
// (RN이 style.left의 "%"를 실제 어떤 박스 기준으로 잡는지 nativewind 레이어를 거치며 실측 너비와
// 어긋난 것으로 보임) 그림도 같은 px 값을 그대로 쓰면 이런 기준 불일치 자체가 생길 수 없음.
export function useSliderDrag({
  value,
  min,
  max,
  step,
  onChange,
  onChangeEnd,
  thumbRadius,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  thumbRadius: number;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const valuePercent = ((value - min) / (max - min)) * 100;
  // 동그라미 "왼쪽 모서리" 기준 픽셀 좌표(중심이 아님) — 그대로 style.left에 넣으면 됨(marginLeft 불필요)
  const thumbLeftPx =
    trackWidth > 0
      ? thumbRadius + (valuePercent / 100) * (trackWidth - thumbRadius * 2) - thumbRadius
      : 0;

  const trackWidthRef = useRef(trackWidth);
  trackWidthRef.current = trackWidth;
  const trackRef = useRef<View>(null);
  const lastValueRef = useRef(value);
  // 제스처 시작 시점의 위치(inset 보정 전, px) — 이후 dx만큼 더해서 이동량 계산
  const gestureStartPxRef = useRef(0);

  function snapToStep(rawValue: number) {
    const stepped = Math.round((rawValue - min) / step) * step + min;
    // 부동소수점 오차(예: 1.2499999999) 정리
    return Math.min(max, Math.max(min, Number(stepped.toFixed(2))));
  }

  // rawPx: inset 보정 전 트랙 폭 기준 위치(px, 범위를 벗어나도 됨 — 아래서 클램프)
  function rawPxToValue(rawPx: number) {
    const width = trackWidthRef.current;
    const span = width - thumbRadius * 2;
    if (width <= 0 || span <= 0) return value;
    const clampedPx = Math.min(width, Math.max(0, rawPx));
    const fraction = Math.min(1, Math.max(0, (clampedPx - thumbRadius) / span));
    return snapToStep(min + fraction * (max - min));
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: event => {
        if (trackWidthRef.current === 0) return;
        gestureStartPxRef.current = event.nativeEvent.locationX;
        const nextValue = rawPxToValue(gestureStartPxRef.current);
        lastValueRef.current = nextValue;
        onChange(nextValue);
      },
      onPanResponderMove: (_event, gestureState) => {
        if (trackWidthRef.current === 0) return;
        const nextValue = rawPxToValue(gestureStartPxRef.current + gestureState.dx);
        lastValueRef.current = nextValue;
        onChange(nextValue);
      },
      onPanResponderRelease: () => onChangeEnd?.(lastValueRef.current),
      onPanResponderTerminate: () => onChangeEnd?.(lastValueRef.current),
    }),
  ).current;

  const onTrackLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return { trackRef, panHandlers: panResponder.panHandlers, onTrackLayout, thumbLeftPx };
}
