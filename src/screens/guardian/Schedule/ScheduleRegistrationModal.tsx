import React, { useState, useRef, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Alert } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';
import { CalendarComponent } from '../../../features/schedule/ui/CalendarComponent';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

// 1. 피그마 스타일 선형 시계 아이콘
const ClockIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#888" strokeWidth="1.8" />
    <Path d="M12 7V12L15 14" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 2. 녹음 마이크 아이콘 (피그마 스타일 - 내부 색상 채움 적용)
const MicIcon = ({ color = '#FF8C00' }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2Z" 
      fill={color} 
      stroke={color} 
      strokeWidth="1" 
    />
    <Path d="M19 10V11C19 14.866 15.866 18 12 18C8.13401 18 5 14.866 5 11V10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M12 18V22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

// 3. 재생 삼각형 아이콘 (피그마 스타일)
const PlayIcon = ({ color = '#FF8C00' }: { color?: string }) => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path d="M5 3L19 12L5 21V3Z" fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

// 4. 삭제 X 아이콘 (피그마 스타일)
const CloseIcon = ({ color = '#FF8C00' }: { color?: string }) => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 스크롤 휠 피커 컴포넌트
const WheelPicker = ({ data, selectedValue, onSelect }: { data: string[]; selectedValue: string; onSelect: (val: string) => void }) => {
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

export const ScheduleRegistrationModal = ({ visible, onClose, onSave }: Props) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const seconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const amPms = ['AM', 'PM'];

  const [scheduleTime, setScheduleTime] = useState({ hour: '06', minute: '28', second: '55', amPm: 'PM' });
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);

  const [alertTime, setAlertTime] = useState({ hour: '06', minute: '28', second: '55', amPm: 'PM' });
  const [showAlertPicker, setShowAlertPicker] = useState(false);

  // 음성 알림 설정 상태 ('tts' 또는 'voice')
  const [soundType, setSoundType] = useState<'tts' | 'voice'>('tts');
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  // 녹음 / 재생 / 삭제 핸들러
  const handleRecord = () => {
    const nextState = !isRecording;
    setIsRecording(nextState);
    setHasRecorded(true);
    Alert.alert('', nextState ? '녹음을 시작합니다...' : '녹음이 완료되었습니다.');
  };

  const handlePlay = () => {
    if (!hasRecorded) {
      Alert.alert('', '재생할 녹음 파일이 없습니다.');
      return;
    }
    Alert.alert('', '녹음된 음성을 재생합니다.');
  };

  const handleDelete = () => {
    setHasRecorded(false);
    setIsRecording(false);
    Alert.alert('', '녹음 파일이 삭제되었습니다.');
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ title, location, selectedDate, scheduleTime, alertTime, soundType, hasRecorded });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 }}>
        <View style={{ width: '100%', maxHeight: '85%', backgroundColor: 'white', borderRadius: 20, padding: 20 }}>
          
          {/* 헤더 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>일정 등록</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#666', padding: 5 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 스크롤 콘텐츠 */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
            
            {/* 1) 일정 이름 */}
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>일정 이름</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}
                placeholder="일정 이름을 입력하세요"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* 2) 장소 */}
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>장소</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#fff' }}
                placeholder="장소를 입력하세요"
                placeholderTextColor="#999"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* 3) 캘린더 */}
            <CalendarComponent 
              currentDate={selectedDate} 
              onDateSelect={(date: Date) => setSelectedDate(date)} 
            />

            {/* 4) 일정 시간 */}
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>일정 시간</Text>
              <TouchableOpacity 
                onPress={() => setShowSchedulePicker(!showSchedulePicker)}
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Text style={{ color: '#333', fontWeight: 'bold' }}>
                  {`${scheduleTime.hour} : ${scheduleTime.minute} : ${scheduleTime.second}  ${scheduleTime.amPm}`}
                </Text>
                <ClockIcon />
              </TouchableOpacity>

              {showSchedulePicker && (
                <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, marginTop: 5, backgroundColor: '#fafafa', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <WheelPicker data={hours} selectedValue={scheduleTime.hour} onSelect={(val) => setScheduleTime(prev => ({ ...prev, hour: val }))} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 2 }}>:</Text>
                    <WheelPicker data={minutes} selectedValue={scheduleTime.minute} onSelect={(val) => setScheduleTime(prev => ({ ...prev, minute: val }))} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 2 }}>:</Text>
                    <WheelPicker data={seconds} selectedValue={scheduleTime.second} onSelect={(val) => setScheduleTime(prev => ({ ...prev, second: val }))} />
                    <WheelPicker data={amPms} selectedValue={scheduleTime.amPm} onSelect={(val) => setScheduleTime(prev => ({ ...prev, amPm: val as 'AM' | 'PM' }))} />
                  </View>
                </View>
              )}
            </View>

            {/* 5) 음성 알림 시간 */}
            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>음성 알림 시간</Text>
              <TouchableOpacity 
                onPress={() => setShowAlertPicker(!showAlertPicker)}
                style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Text style={{ color: '#333', fontWeight: 'bold' }}>
                  {`${alertTime.hour} : ${alertTime.minute} : ${alertTime.second}  ${alertTime.amPm}`}
                </Text>
                <ClockIcon />
              </TouchableOpacity>

              {showAlertPicker && (
                <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, marginTop: 5, backgroundColor: '#fafafa', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <WheelPicker data={hours} selectedValue={alertTime.hour} onSelect={(val) => setAlertTime(prev => ({ ...prev, hour: val }))} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 2 }}>:</Text>
                    <WheelPicker data={minutes} selectedValue={alertTime.minute} onSelect={(val) => setAlertTime(prev => ({ ...prev, minute: val }))} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginHorizontal: 2 }}>:</Text>
                    <WheelPicker data={seconds} selectedValue={alertTime.second} onSelect={(val) => setAlertTime(prev => ({ ...prev, second: val }))} />
                    <WheelPicker data={amPms} selectedValue={alertTime.amPm} onSelect={(val) => setAlertTime(prev => ({ ...prev, amPm: val as 'AM' | 'PM' }))} />
                  </View>
                </View>
              )}
            </View>

            {/* 6) 음성 알림 설정 */}
            <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 15, backgroundColor: '#fcfcfc', marginBottom: 15 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 12, color: '#333' }}>음성 알림 설정</Text>

              {/* 기본 알림용 (TTS) 선택 */}
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
                onPress={() => setSoundType('tts')}
              >
                <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: soundType === 'tts' ? '#FF8C00' : '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                  {soundType === 'tts' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF8C00' }} />}
                </View>
                <Text style={{ fontSize: 14, color: '#333' }}>기본 알림용 (TTS)</Text>
              </TouchableOpacity>

              {/* 보호자 음성 녹음 선택 */}
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: soundType === 'voice' ? 12 : 0 }}
                onPress={() => setSoundType('voice')}
              >
                <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: soundType === 'voice' ? '#FF8C00' : '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                  {soundType === 'voice' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF8C00' }} />}
                </View>
                <Text style={{ fontSize: 14, color: '#333' }}>보호자 음성 녹음</Text>
              </TouchableOpacity>

              {/* 음성 녹음 버튼 그룹 */}
              {soundType === 'voice' && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingLeft: 26 }}>
                  
                  {/* 녹음 버튼 (내부 채움 마이크 적용) */}
                  <TouchableOpacity 
                    style={{ flex: 1, borderWidth: 1.5, borderColor: isRecording ? '#ff4d4f' : '#FF9800', borderRadius: 8, paddingVertical: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 6, backgroundColor: '#fff' }}
                    onPress={handleRecord}
                  >
                    <MicIcon color={isRecording ? '#ff4d4f' : '#FF9800'} />
                    <Text style={{ fontSize: 13, color: isRecording ? '#ff4d4f' : '#FF9800', fontWeight: 'bold', marginLeft: 5 }}>
                      {isRecording ? '정지' : '녹음'}
                    </Text>
                  </TouchableOpacity>

                  {/* 재생 버튼 */}
                  <TouchableOpacity 
                    style={{ flex: 1, borderWidth: 1.5, borderColor: '#FF9800', borderRadius: 8, paddingVertical: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 3, backgroundColor: '#fff' }}
                    onPress={handlePlay}
                  >
                    <PlayIcon color="#FF9800" />
                    <Text style={{ fontSize: 13, color: '#FF9800', fontWeight: 'bold', marginLeft: 5 }}>재생</Text>
                  </TouchableOpacity>

                  {/* 삭제 버튼 */}
                  <TouchableOpacity 
                    style={{ flex: 1, borderWidth: 1.5, borderColor: '#FF9800', borderRadius: 8, paddingVertical: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 6, backgroundColor: '#fff' }}
                    onPress={handleDelete}
                  >
                    <CloseIcon color="#FF9800" />
                    <Text style={{ fontSize: 13, color: '#FF9800', fontWeight: 'bold', marginLeft: 5 }}>삭제</Text>
                  </TouchableOpacity>

                </View>
              )}
            </View>

            {/* 저장하기 버튼 */}
            <TouchableOpacity 
              style={{ backgroundColor: '#FF8C00', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 }} 
              onPress={handleSave}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>저장하기</Text>
            </TouchableOpacity>

          </ScrollView>

        </View>
      </View>
    </Modal>
  );
};