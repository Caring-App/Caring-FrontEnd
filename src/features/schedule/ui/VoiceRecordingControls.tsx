import React from 'react';
import { Pressable, Text, View } from 'react-native';
import MicrophoneIcon from '@assets/icons/schedule/microphone-outline.svg';
import PlayIcon from '@assets/icons/action/play-fill.svg';
import DeleteIcon from '@assets/icons/action/delete.svg';

interface VoiceRecordingControlsProps {
  isRecording: boolean;
  onRecord: () => void;
  onPlay: () => void;
  onDelete: () => void;
}

function RecordingButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="h-12 flex-1 flex-row items-center justify-center gap-1.5 rounded-md border border-primary bg-surface">
      {icon}
      <Text className="font-pretendard-medium text-md text-text-primary">{label}</Text>
    </Pressable>
  );
}

export function VoiceRecordingControls({ isRecording, onRecord, onPlay, onDelete }: VoiceRecordingControlsProps) {
  return (
    <View className="mt-3 flex-row gap-2">
      <RecordingButton
        icon={<MicrophoneIcon width={16} height={16} />}
        label={isRecording ? '정지' : '녹음'}
        onPress={onRecord}
      />
      <RecordingButton
        icon={<PlayIcon width={12} height={12} style={{ transform: [{ rotate: '90deg' }] }} />}
        label="재생"
        onPress={onPlay}
      />
      <RecordingButton icon={<DeleteIcon width={16} height={16} />} label="삭제" onPress={onDelete} />
    </View>
  );
}
