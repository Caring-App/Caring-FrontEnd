// VoiceSettingsSection.tsx 파일 전체 내용

import React from 'react'; // React import 추가
import { View, Text, TouchableOpacity } from 'react-native';
import  WheelPicker  from 'react-native-wheel-pick';
import { styles } from '../../../styles/ScheduleStyles';

export const VoiceSettingsSection = ({ voiceOption, setVoiceOption }: any) => {
  return ( // 반드시 return이 있어야 합니다!
    <View style={styles.voiceSettingContainer}>
      <Text style={styles.label}>음성 알림 설정</Text>
      <TouchableOpacity style={styles.radioOption} onPress={() => setVoiceOption('tts')}>
        <View style={[styles.radioCircle, voiceOption === 'tts' && styles.radioChecked]} />
        <Text style={styles.radioText}>기능 알림음 (TTS)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.radioOption} onPress={() => setVoiceOption('recording')}>
        <View style={[styles.radioCircle, voiceOption === 'recording' && styles.radioChecked]} />
        <Text style={styles.radioText}>보호자 음성 녹음</Text>
      </TouchableOpacity>

      <View style={styles.voiceButtonContainer}>
        <TouchableOpacity style={styles.voiceBtn}><Text style={styles.voiceBtnText}>녹음</Text></TouchableOpacity>
        <TouchableOpacity style={styles.voiceBtn}><Text style={styles.voiceBtnText}>재생</Text></TouchableOpacity>
        <TouchableOpacity style={styles.voiceBtn}><Text style={styles.voiceBtnText}>삭제</Text></TouchableOpacity>
      </View>
    </View>
  );
};