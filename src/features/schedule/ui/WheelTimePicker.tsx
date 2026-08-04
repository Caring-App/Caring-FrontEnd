import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { TimeState } from '../model/scheduleRegistrationTypes';
import { WHEEL_HEIGHT, WHEEL_ITEM_HEIGHT, WheelColumn } from './WheelColumn';

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const SECONDS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const AM_PM: Array<'AM' | 'PM'> = ['AM', 'PM'];

function Colon() {
  return (
    <View style={{ height: WHEEL_ITEM_HEIGHT, width: 12 }} className="items-center justify-center">
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
      { values: HOURS, key: 'hour' as const, width: 56 },
      { values: MINUTES, key: 'minute' as const, width: 56 },
      { values: SECONDS, key: 'second' as const, width: 56 },
    ],
    [],
  );

  return (
    <View
      style={{ height: WHEEL_HEIGHT, elevation: 1, alignSelf: 'center' }}
      className="relative flex-row items-center justify-center rounded-xl border border-border-divider bg-white px-6">
      <View
        pointerEvents="none"
        className="absolute left-3 right-3 border-t border-wheel-divider"
        style={{ top: WHEEL_ITEM_HEIGHT }}
      />
      <View
        pointerEvents="none"
        className="absolute left-3 right-3 border-b border-wheel-divider"
        style={{ top: WHEEL_ITEM_HEIGHT * 2 }}
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

      <View style={{ marginLeft: 32 }}>
        <WheelColumn
          values={AM_PM}
          selectedValue={value.amPm}
          width={60}
          onChange={(next) => onChange({ ...value, amPm: next as 'AM' | 'PM' })}
        />
      </View>
    </View>
  );
}
