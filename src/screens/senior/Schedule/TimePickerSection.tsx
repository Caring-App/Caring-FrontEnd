import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export interface TimePickerProps {
  label: string;
  hour: string;
  minute: string;
  amPm: 'AM' | 'PM';
  onHourChange: (val: string) => void;
  onMinuteChange: (val: string) => void;
  onAmPmChange: (val: 'AM' | 'PM') => void;
}

export const TimePickerSection = (props: TimePickerProps) => {
  // 01~12 시간 배열 생성
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  // 00~59 분 배열 생성
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{props.label}</Text>
      <View style={{ flexDirection: 'row', height: 150, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, overflow: 'hidden' }}>
        
        {/* 오전/오후 선택 */}
        <View style={{ flex: 1, borderRightWidth: 1, borderColor: '#eee' }}>
          <ScrollView>
            {['AM', 'PM'].map(item => (
              <TouchableOpacity key={item} onPress={() => props.onAmPmChange(item as 'AM' | 'PM')} style={{ padding: 15 }}>
                <Text style={{ textAlign: 'center', color: props.amPm === item ? 'orange' : 'black' }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 시간 스크롤 */}
        <View style={{ flex: 1, borderRightWidth: 1, borderColor: '#eee' }}>
          <ScrollView>
            {hours.map(h => (
              <TouchableOpacity key={h} onPress={() => props.onHourChange(h)} style={{ padding: 15 }}>
                <Text style={{ textAlign: 'center', color: props.hour === h ? 'orange' : 'black' }}>{h}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 분 스크롤 */}
        <View style={{ flex: 1 }}>
          <ScrollView>
            {minutes.map(m => (
              <TouchableOpacity key={m} onPress={() => props.onMinuteChange(m)} style={{ padding: 15 }}>
                <Text style={{ textAlign: 'center', color: props.minute === m ? 'orange' : 'black' }}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </View>
    </View>
  );
};