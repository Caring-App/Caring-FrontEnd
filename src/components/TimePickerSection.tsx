import React from 'react';
import { View, Text } from 'react-native';
// @ts-ignore
import { WheelPicker } from 'react-native-wheel-pick';
import { styles } from '../styles/ScheduleStyles';

export const TimePickerSection = ({ label, hour, minute, second, amPm, onHourChange, onMinuteChange, onSecondChange, onAmPmChange }: any) => {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerCard}>
        <WheelPicker style={styles.wheel} isCyclic data={Array.from({length: 12}, (_, i) => String(i+1).padStart(2, '0'))} selectedItem={hour} onItemSelected={onHourChange} />
        <Text style={styles.colon}>:</Text>
        <WheelPicker style={styles.wheel} isCyclic data={Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'))} selectedItem={minute} onItemSelected={onMinuteChange} />
        <Text style={styles.colon}>:</Text>
        <WheelPicker style={styles.wheel} isCyclic data={Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'))} selectedItem={second} onItemSelected={onSecondChange} />
        <WheelPicker style={[styles.wheel, { flex: 1.3 }]} data={['PM', 'AM']} selectedItem={amPm} onItemSelected={onAmPmChange} />
      </View>
    </>
  );
};