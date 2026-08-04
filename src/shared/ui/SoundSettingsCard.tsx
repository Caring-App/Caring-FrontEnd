import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RadioButton } from './RadioButton';
import { VoiceRecordingControls } from './VoiceRecordingControls';

type SoundType = 'tts' | 'voice';

interface SoundSettingsCardProps {
  soundType: SoundType;
  onChangeSoundType: (type: SoundType) => void;
  isRecording: boolean;
  onRecord: () => void;
  onPlay: () => void;
  onDelete: () => void;
}

const SOUND_OPTIONS: { type: SoundType; label: string }[] = [
  { type: 'tts', label: '기본 알림음 (TTS)' },
  { type: 'voice', label: '보호자 음성 녹음' },
];

export function SoundSettingsCard({
  soundType,
  onChangeSoundType,
  isRecording,
  onRecord,
  onPlay,
  onDelete,
}: SoundSettingsCardProps) {
  return (
    <View className="mt-5 rounded-card border border-border p-4">
      <Text style={styles.sectionTitle} className="font-pretendard-bold text-base text-text-primary">
        음성 알림 설정
      </Text>
      {SOUND_OPTIONS.map(({ type, label }) => {
        const active = soundType === type;
        return (
          <View key={type} style={styles.soundOption} className="last:mb-0">
            <Pressable
              onPress={() => onChangeSoundType(type)}
              style={styles.soundOptionRow}
              className="flex-row items-center">
              <RadioButton selected={active} />
              <Text className="font-pretendard-semibold text-lg text-text-body">{label}</Text>
            </Pressable>
            {type === 'voice' && active && (
              <VoiceRecordingControls isRecording={isRecording} onRecord={onRecord} onPlay={onPlay} onDelete={onDelete} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { marginBottom: 21 },
  soundOption: { marginBottom: 7 },
  soundOptionRow: { gap: 10 },
});
