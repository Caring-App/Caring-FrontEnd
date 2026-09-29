import React from 'react';
import { Pressable, Text, View } from 'react-native';
import MicrophoneIcon from '@assets/icons/schedule/microphone-outline.svg';
import PlayIcon from '@assets/icons/action/play-fill.svg';
import DeleteIcon from '@assets/icons/action/delete.svg';
import type { VoiceRecordingState } from '@shared/model';


function RecordingButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`h-12 flex-1 flex-row items-center justify-center gap-1.5 rounded-md border border-primary bg-surface ${
        disabled ? 'opacity-40' : ''
      }`}>
      {icon}
      <Text className="font-pretendard-medium text-md text-text-primary">{label}</Text>
    </Pressable>
  );
}

function getStatusMessage(isRecording: boolean, isPlaying: boolean, hasRecorded: boolean) {
  if (isRecording) return '녹음 중이에요. 정지를 누르면 녹음이 끝나요.';
  if (isPlaying) return '녹음된 음성을 재생하고 있어요.';
  if (hasRecorded) return '녹음된 음성이 있어요. 저장하면 이 음성으로 안내해요.';
  return '녹음 버튼을 눌러 어르신께 들려드릴 음성을 녹음해 주세요.';
}

export function VoiceRecordingControls({ recording }: { recording: VoiceRecordingState }) {
  const { isRecording, isPlaying, hasRecorded, isBusy, onRecord, onPlay, onDelete } = recording;
  return (
    <View className="mt-3">
      <View className="flex-row gap-2">
        <RecordingButton
          icon={<MicrophoneIcon width={16} height={16} />}
          label={isRecording ? '정지' : '녹음'}
          onPress={onRecord}
          disabled={isBusy}
        />
        <RecordingButton
          icon={<PlayIcon width={12} height={12} style={{ transform: [{ rotate: '90deg' }] }} />}
          label={isPlaying ? '정지' : '재생'}
          onPress={onPlay}
          disabled={isRecording || isBusy || !hasRecorded}
        />
        <RecordingButton
          icon={<DeleteIcon width={16} height={16} />}
          label="삭제"
          onPress={onDelete}
          disabled={isBusy || (!hasRecorded && !isRecording)}
        />
      </View>
      <Text className={`mt-2 font-pretendard text-sm ${isRecording ? 'text-primary' : 'text-text-muted'}`}>
        {getStatusMessage(isRecording, isPlaying, hasRecorded)}
      </Text>
    </View>
  );
}
