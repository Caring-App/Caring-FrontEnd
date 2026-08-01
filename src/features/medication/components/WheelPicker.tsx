import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

interface WheelPickerProps {
  data: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;
const REPEAT_COUNT = 20;

export const WheelPicker = ({ data, selectedValue, onSelect }: WheelPickerProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  const isInfinite = data && data.length > 2;
  const originalLength = data ? data.length : 1;

  // 안전하게 인덱스 찾기 (못 찾으면 0번 인덱스)
  const foundIndex = data ? data.indexOf(selectedValue) : -1;
  const initialIndex = foundIndex > -1 ? foundIndex : 0;

  // 반복 데이터 생성
  const repeatedData = isInfinite
    ? Array.from({ length: REPEAT_COUNT }, () => data).flat()
    : (data ?? []);

  const displayData = ['', ...repeatedData, ''];
  const middleBlock = Math.floor(REPEAT_COUNT / 2);

  useEffect(() => {
    if (scrollViewRef.current && data && data.length > 0) {
      const startIndex = isInfinite
        ? middleBlock * originalLength + initialIndex
        : initialIndex;

      // 렌더링 직후 스크롤 이동 시 안전하게 딜레이나 타이밍 보장
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: startIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 0);
    }
  }, []);

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!data || data.length === 0) return;

    const offsetY = e.nativeEvent.contentOffset.y;
    const rawIndex = Math.round(offsetY / ITEM_HEIGHT);

    if (!isInfinite) {
      const actualIndex = Math.max(0, Math.min(rawIndex, data.length - 1));
      if (data[actualIndex] && data[actualIndex] !== selectedValue) {
        onSelect(data[actualIndex]);
      }
      return;
    }

    const totalItems = repeatedData.length;
    const realIndex = ((rawIndex % originalLength) + originalLength) % originalLength;
    const selectedItem = data[realIndex];

    if (selectedItem && selectedItem !== selectedValue) {
      onSelect(selectedItem);
    }

    if (rawIndex < originalLength * 2 || rawIndex > totalItems - originalLength * 2) {
      const targetIndex = middleBlock * originalLength + realIndex;
      scrollViewRef.current?.scrollTo({
        y: targetIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
        nestedScrollEnabled={true}
      >
        {displayData.map((item, index) => {
          const isSelected = item !== '' && item === selectedValue;
          return (
            <View key={index} style={styles.itemContainer}>
              <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: 60,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  selectedItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A202C',
  },
});