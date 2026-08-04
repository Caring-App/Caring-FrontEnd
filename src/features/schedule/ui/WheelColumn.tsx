import React, { useEffect, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';

export const WHEEL_ITEM_HEIGHT = 36;
export const WHEEL_VISIBLE_ROWS = 3;
export const WHEEL_HEIGHT = WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_ROWS;

interface WheelColumnProps {
  values: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  width: number;
}

export function WheelColumn({ values, selectedValue, onChange, width }: WheelColumnProps) {
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = Math.max(0, values.indexOf(selectedValue));

  // contentOffset은 최초 마운트에만 적용되므로, 마운트된 채로 selectedValue가
  // 외부에서 바뀌는 경우(예: 모달을 다시 열며 값을 리셋)에도 휠이 따라가도록 한다.
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: selectedIndex * WHEEL_ITEM_HEIGHT, animated: false });
  }, [selectedIndex]);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / WHEEL_ITEM_HEIGHT);
    const clamped = Math.min(values.length - 1, Math.max(0, index));
    onChange(values[clamped]);
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.scroll, { height: WHEEL_HEIGHT, width }]}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      snapToInterval={WHEEL_ITEM_HEIGHT}
      decelerationRate="fast"
      contentContainerStyle={{ paddingVertical: WHEEL_ITEM_HEIGHT }}
      contentOffset={{ x: 0, y: selectedIndex * WHEEL_ITEM_HEIGHT }}
      onMomentumScrollEnd={handleMomentumScrollEnd}>
      {values.map((value) => {
        const isActive = value === selectedValue;
        return (
          <View key={value} style={{ height: WHEEL_ITEM_HEIGHT }} className="items-center justify-center">
            <Text className={`font-pretendard-semibold text-md ${isActive ? 'text-wheel-active' : 'text-wheel-muted'}`}>
              {value}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, flexShrink: 0 },
});
