import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { styles } from '../styles/medicationModal.styles';

interface WheelPickerProps {
  data: string[];
  selectedValue: string;
  onSelect: (val: string) => void;
}

export const WheelPicker = ({ data, selectedValue, onSelect }: WheelPickerProps) => {
  const itemHeight = 40;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const index = data.indexOf(selectedValue);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: index * itemHeight, animated: false });
    }
  }, []);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    if (data[index]) {
      onSelect(data[index]);
    }
  };

  return (
    <View style={styles.wheelWrapper}>
      <View style={styles.wheelHighlight} pointerEvents="none" />
      
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{ paddingVertical: itemHeight }}
        nestedScrollEnabled={true}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.wheelItem}>
            <Text style={styles.wheelText(item === selectedValue)}>
            {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};