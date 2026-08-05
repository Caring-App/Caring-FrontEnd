import { useState } from 'react';
import { Alert } from 'react-native';

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const reset = () => {
    setIsRecording(false);
    setHasRecorded(false);
  };

  const handleRecord = () => {
    const nextIsRecording = !isRecording;
    setIsRecording(nextIsRecording);
    if (!nextIsRecording) {
      setHasRecorded(true);
    }
  };

  const handlePlay = () => {
    if (!hasRecorded) {
      Alert.alert('', '재생할 녹음이 없습니다.');
      return;
    }
    Alert.alert('', '녹음된 음성을 재생합니다.');
  };

  return { isRecording, hasRecorded, handleRecord, handlePlay, handleDeleteRecording: reset, reset };
}
