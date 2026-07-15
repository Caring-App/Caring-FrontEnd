import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../../styles/MedicationStyles';
// @ts-ignore
import { WheelPicker } from 'react-native-wheel-pick';

export const TimePickerSection = ({ hours, minutesSeconds, takeHour, setTakeHour, takeMinute, setTakeMinute, takeSecond, setTakeSecond, takeAmPm, setTakeAmPm }: any) => (
  <View style={styles.cardBox}>
    <Text style={styles.label}>시간 선택</Text>
    <View style={styles.pickerCard}>
      <WheelPicker style={styles.wheel} isCyclic data={hours} selectedItem={takeHour} onItemSelected={setTakeHour} />
      <Text style={styles.colon}>:</Text>
      <WheelPicker style={styles.wheel} isCyclic data={minutesSeconds} selectedItem={takeMinute} onItemSelected={setTakeMinute} />
      <Text style={styles.colon}>:</Text>
      <WheelPicker style={styles.wheel} isCyclic data={minutesSeconds} selectedItem={takeSecond} onItemSelected={setTakeSecond} />
      <WheelPicker style={[styles.wheel, { flex: 1.3 }]} data={['PM', 'AM']} selectedItem={takeAmPm} onItemSelected={setTakeAmPm} />
    </View>
  </View>
);