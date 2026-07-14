import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/ScheduleStyles';

export const VoiceSettingsSection = ({ voiceOption, setVoiceOption }: any) => (
  <View style={styles.voiceSettingContainer}>
    <Text style={styles.label}>음성 알림 설정</Text>
    <TouchableOpacity style={styles.radioOption} onPress={() => setVoiceOption('tts')}>
      <View style={[styles.radioCircle, voiceOption === 'tts' && styles.radioChecked]} />
      <Text style={styles.radioText}>기본 알림음 (TTS)</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.radioOption} onPress={() => setVoiceOption('recording')}>
      <View style={[styles.radioCircle, voiceOption === 'recording' && styles.radioChecked]} />
      <Text style={styles.radioText}>보호자 음성 녹음</Text>
    </TouchableOpacity>
    <View style={styles.voiceButtonContainer}>
      <TouchableOpacity style={styles.voiceBtn}><Text style={styles.voiceBtnText}>🎙 녹음</Text></TouchableOpacity>
      <TouchableOpacity style={styles.voiceBtn}><Text style={styles.voiceBtnText}>▶ 재생</Text></TouchableOpacity>
      <TouchableOpacity style={styles.voiceBtn}><Text style={styles.voiceBtnText}>✕ 삭제</Text></TouchableOpacity>
    </View>
  </View>
);