import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

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
    <View style={{ height: itemHeight * 3, width: 65, alignItems: 'center', overflow: 'hidden' }}>
      <View style={{ position: 'absolute', top: itemHeight, height: itemHeight, width: '100%', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#FF8C00', backgroundColor: 'rgba(255,140,0,0.08)' }} pointerEvents="none" />
      
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
          <View key={index} style={{ height: itemHeight, justifyContent: 'center', alignItems: 'center', width: 65 }}>
            <Text style={{ fontSize: 16, fontWeight: item === selectedValue ? 'bold' : 'normal', color: item === selectedValue ? '#FF8C00' : '#888' }}>
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};