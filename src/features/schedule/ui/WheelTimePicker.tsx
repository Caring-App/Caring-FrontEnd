import React, { useMemo, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';
import { TimeState } from '../model/scheduleRegistrationTypes';

const ITEM_HEIGHT = 36;
const VISIBLE_ROWS = 3;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const SECONDS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const AM_PM: Array<'AM' | 'PM'> = ['AM', 'PM'];

interface WheelColumnProps {
  values: string[];
  selectedValue: string;
  onChange: (value: string) => void;
  width: number;
}

function WheelColumn({ values, selectedValue, onChange, width }: WheelColumnProps) {
  const scrollRef = useRef<ScrollView>(null);
  const selectedIndex = Math.max(0, values.indexOf(selectedValue));

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.min(values.length - 1, Math.max(0, index));
    onChange(values[clamped]);
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={{ height: WHEEL_HEIGHT, width }}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
      contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
      onMomentumScrollEnd={handleMomentumScrollEnd}>
      {values.map((value) => {
        const isActive = value === selectedValue;
        return (
          <View key={value} style={{ height: ITEM_HEIGHT }} className="items-center justify-center">
            <Text
              className={`font-pretendard-semibold text-md ${isActive ? 'text-wheel-active' : 'text-wheel-muted'}`}>
              {value}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

function Colon() {
  return (
    <View style={{ height: ITEM_HEIGHT, width: 4 }} className="items-center justify-center">
      <Text className="font-pretendard-bold text-md text-wheel-active">:</Text>
    </View>
  );
}

interface WheelTimePickerProps {
  value: TimeState;
  onChange: (next: TimeState) => void;
}

export function WheelTimePicker({ value, onChange }: WheelTimePickerProps) {
  const rows = useMemo(
    () => [
      { values: HOURS, key: 'hour' as const, width: 22 },
      { values: MINUTES, key: 'minute' as const, width: 22 },
      { values: SECONDS, key: 'second' as const, width: 22 },
    ],
    [],
  );

  return (
    <View
      style={{ height: WHEEL_HEIGHT, elevation: 1, alignSelf: 'center' }}
      className="relative flex-row items-center justify-center rounded-xl border border-border-divider bg-white px-4">
      <View
        pointerEvents="none"
        className="absolute left-3 right-3 border-t border-wheel-divider"
        style={{ top: ITEM_HEIGHT }}
      />
      <View
        pointerEvents="none"
        className="absolute left-3 right-3 border-b border-wheel-divider"
        style={{ top: ITEM_HEIGHT * 2 }}
      />

      {rows.map((row, index) => (
        <React.Fragment key={row.key}>
          {index > 0 && <Colon />}
          <WheelColumn
            values={row.values}
            selectedValue={value[row.key]}
            width={row.width}
            onChange={(next) => onChange({ ...value, [row.key]: next })}
          />
        </React.Fragment>
      ))}

      <View style={{ marginLeft: 6 }}>
        <WheelColumn
          values={AM_PM}
          selectedValue={value.amPm}
          width={28}
          onChange={(next) => onChange({ ...value, amPm: next as 'AM' | 'PM' })}
        />
      </View>
    </View>
  );
}
