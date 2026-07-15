import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const VoiceSettingsSection = () => {
  const [selectedVoice, setSelectedVoice] = useState('TTS');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>음성 알림 설정</Text>
      
      <TouchableOpacity onPress={() => setSelectedVoice('TTS')} style={styles.radio}>
        <Text>{selectedVoice === 'TTS' ? '◉' : '○'} 기본 알림음 (TTS)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setSelectedVoice('Record')} style={styles.radio}>
        <Text>{selectedVoice === 'Record' ? '◉' : '○'} 보호자 음성 녹음</Text>
      </TouchableOpacity>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button}><Text>⬇ 녹음</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text>▶ 재생</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text>✖ 삭제</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginTop: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  radio: { marginVertical: 5 },
  buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }
});