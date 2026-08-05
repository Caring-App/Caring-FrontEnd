import React from 'react';
import { View } from 'react-native';

export function RadioButton({ selected }: { selected: boolean }) {
  return (
    <View
      className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
        selected ? 'border-primary' : 'border-border-link'
      }`}>
      {selected && <View className="h-3 w-3 rounded-full bg-primary" />}
    </View>
  );
}
