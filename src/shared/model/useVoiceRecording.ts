import { useEffect, useRef, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { createSound } from 'react-native-nitro-sound';
import { uploadVoiceFileApi } from '@shared/api/voiceApi';

async function requestMicrophonePermission() {
  // iOS는 녹음을 처음 시작할 때 시스템이 Info.plist(NSMicrophoneUsageDescription) 문구로 직접 물어봄
  if (Platform.OS !== 'android') return true;
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
    title: '마이크 권한',
    message: '어르신께 들려드릴 음성 안내를 녹음하려면 마이크 권한이 필요해요.',
    buttonPositive: '허용',
    buttonNegative: '거부',
  });
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    Alert.alert('', '마이크 권한이 꺼져 있어요. 설정에서 마이크 권한을 허용해 주세요.', [
      { text: '취소', style: 'cancel' },
      { text: '설정 열기', onPress: () => Linking.openSettings() },
    ]);
  }
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

// 복약/일정 등록 모달의 "보호자 음성 녹음" — 녹음·재생·삭제 + 저장 시 서버 업로드.
// 녹음 파일은 기기에만 있다가 저장할 때(getVoiceFileUrl) 한 번 업로드해서 URL로 바꿈
// → 녹음만 하고 모달을 닫으면 서버에 불필요한 파일이 쌓이지 않음.
// 수정 모달에서는 이미 서버에 있는 녹음(savedUrl)을 그대로 재생·유지할 수 있음.
export function useVoiceRecording() {
  const soundRef = useRef(createSound());
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // 녹음 시작/정지가 네이티브 백그라운드 스레드에서 처리돼 잠깐 걸리므로 그동안 버튼 연타를 막는 용도
  const [isBusy, setIsBusy] = useState(false);
  const [localPath, setLocalPath] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  const hasRecorded = !!localPath || !!savedUrl;

  const stopPlayback = async () => {
    soundRef.current.removePlaybackEndListener();
    await soundRef.current.stopPlayer().catch(() => {});
    setIsPlaying(false);
  };

  // 모달이 닫히거나 화면을 벗어나면 녹음·재생을 멈춤
  useEffect(() => {
    const sound = soundRef.current;
    return () => {
      sound.removePlaybackEndListener();
      sound.stopRecorder().catch(() => {});
      sound.stopPlayer().catch(() => {});
    };
  }, []);

  // 모달을 새로 열 때 호출 — 수정 모달이면 기존에 저장된 녹음 URL을 넘김
  const reset = (initialUrl?: string | null) => {
    if (isRecording) soundRef.current.stopRecorder().catch(() => {});
    if (isPlaying) stopPlayback();
    setIsRecording(false);
    setLocalPath(null);
    setSavedUrl(initialUrl || null);
  };

  const handleRecord = async () => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      if (isRecording) {
        const path = await soundRef.current.stopRecorder();
        setIsRecording(false);
        setLocalPath(path);
        return;
      }
      if (!(await requestMicrophonePermission())) return;
      if (isPlaying) await stopPlayback();
      await soundRef.current.startRecorder();
      setIsRecording(true);
    } catch (error) {
      console.error('[useVoiceRecording] 녹음 실패', error);
      setIsRecording(false);
      Alert.alert('', '녹음을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsBusy(false);
    }
  };

  // 재생 버튼 — 재생 중에 다시 누르면 정지
  const handlePlay = async () => {
    if (isRecording || isBusy) return;
    if (isPlaying) {
      await stopPlayback();
      return;
    }
    const source = localPath ?? savedUrl;
    if (!source) {
      Alert.alert('', '재생할 녹음이 없습니다.');
      return;
    }
    try {
      soundRef.current.addPlaybackEndListener(() => {
        soundRef.current.removePlaybackEndListener();
        setIsPlaying(false);
      });
      await soundRef.current.startPlayer(source);
      setIsPlaying(true);
    } catch (error) {
      console.error('[useVoiceRecording] 재생 실패', error);
      setIsPlaying(false);
      Alert.alert('', '녹음을 재생하지 못했어요.');
    }
  };

  const handleDeleteRecording = async () => {
    if (isBusy) return;
    if (isRecording) {
      await soundRef.current.stopRecorder().catch(() => {});
      setIsRecording(false);
    }
    if (isPlaying) await stopPlayback();
    setLocalPath(null);
    setSavedUrl(null);
  };

  // 저장 직전에 호출 — 새로 녹음한 게 있으면 업로드해서 URL을, 없으면 기존 URL(없으면 빈 문자열)을 돌려줌.
  // 업로드 실패는 그대로 던져서 저장 자체를 실패 처리하게 함
  const getVoiceFileUrl = async (): Promise<string> => {
    if (localPath) {
      const url = await uploadVoiceFileApi(localPath);
      setSavedUrl(url);
      setLocalPath(null);
      return url;
    }
    return savedUrl ?? '';
  };

  return {
    isRecording,
    isPlaying,
    isBusy,
    hasRecorded,
    handleRecord,
    handlePlay,
    handleDeleteRecording,
    reset,
    getVoiceFileUrl,
  };
}
