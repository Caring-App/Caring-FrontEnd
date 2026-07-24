import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

interface WheelPickerProps {
  data: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;
// 무한 루프 느낌을 주기 위해 원본 배열을 20번 반복
const REPEAT_COUNT = 20;

export const WheelPicker = ({ data, selectedValue, onSelect }: WheelPickerProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  // 항목이 1~2개뿐인 재알림(옵션이 적은 경우) 등에서는 일반 스크롤, 
  // 시간/분/초처럼 계속 돌아가는 데이터는 무한 루프 적용
  const isInfinite = data.length > 2;

  // 반복 데이터 생성
  const repeatedData = isInfinite
    ? Array.from({ length: REPEAT_COUNT }, () => data).flat()
    : data;

  // 패딩을 더한 최종 데이터 (상, 하 빈 칸)
  const displayData = ['', ...repeatedData, ''];

  const originalLength = data.length;
  const middleBlock = Math.floor(REPEAT_COUNT / 2); // 10번째 블록
  const initialIndex = data.indexOf(selectedValue);

  // 초기 위치를 데이터의 "가운데 섹션"으로 세팅
  useEffect(() => {
    if (scrollViewRef.current) {
      const startIndex = isInfinite
        ? middleBlock * originalLength + (initialIndex > -1 ? initialIndex : 0)
        : (initialIndex > -1 ? initialIndex : 0);

      scrollViewRef.current.scrollTo({
        y: startIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, []);

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const rawIndex = Math.round(offsetY / ITEM_HEIGHT);

    if (!isInfinite) {
      // 일반 스크롤 처리
      const actualIndex = Math.max(0, Math.min(rawIndex, data.length - 1));
      if (data[actualIndex] && data[actualIndex] !== selectedValue) {
        onSelect(data[actualIndex]);
      }
      return;
    }

    // 무한 루프 처리
    const totalItems = repeatedData.length;
    const realIndex = rawIndex % originalLength; // 실제 원본 값에서의 인덱스
    const selectedItem = data[realIndex];

    if (selectedItem && selectedItem !== selectedValue) {
      onSelect(selectedItem);
    }

    // 스크롤이 너무 위로 가거나 너무 아래로 내려갔을 때
    // 사용자 눈에 띄지 않게 중앙 블록으로 위치 보정 (Loop)
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
          // 양 끝 패딩이 아닌 경우 값 비교
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