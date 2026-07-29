import { useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, View } from 'react-native';

// 트랙을 손가락으로 눌러/드래그해서 0~100 값을 정하는 로직.
export function useSliderDrag({
  value,
  onChange,
  thumbRadius,
}: {
  value: number;
  onChange: (value: number) => void;
  thumbRadius: number;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const insetPercent = trackWidth > 0 ? (thumbRadius / trackWidth) * 100 : 0;
  const thumbPositionPercent = insetPercent + (value / 100) * (100 - insetPercent * 2);

  const insetPercentRef = useRef(insetPercent);
  insetPercentRef.current = insetPercent;
  const trackRef = useRef<View>(null);
  const trackWidthRef = useRef(0);
  const trackPageXRef = useRef(0);

  function positionPercentToValue(positionPercent: number) {
    const inset = insetPercentRef.current;
    const span = 100 - inset * 2;
    if (span <= 0) return value;
    return Math.min(100, Math.max(0, ((positionPercent - inset) / span) * 100));
  }

  const handleTouch = (pageX: number) => {
    if (trackWidthRef.current === 0) return;
    const positionPercent = ((pageX - trackPageXRef.current) / trackWidthRef.current) * 100;
    onChange(positionPercentToValue(positionPercent));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: event => handleTouch(event.nativeEvent.pageX),
      onPanResponderMove: event => handleTouch(event.nativeEvent.pageX),
    }),
  ).current;

  const onTrackLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    trackWidthRef.current = width;
    setTrackWidth(width);
    trackRef.current?.measure((_x, _y, measuredWidth, _height, pageX) => {
      trackWidthRef.current = measuredWidth;
      trackPageXRef.current = pageX;
    });
  };

  return { trackRef, panHandlers: panResponder.panHandlers, onTrackLayout, thumbPositionPercent };
}
