import { useEffect, useState } from 'react';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { createSound } from 'react-native-nitro-sound';
import { uploadVoiceFileApi } from '@shared/api/voiceApi';
import type { SoundType } from '@shared/types';
import { showNotice } from './useNoticeStore';

// useVoiceRecording().controls — 녹음 UI(SoundSettingsCard/VoiceRecordingControls)가 필요로 하는 상태·동작을 한 묶음으로 전달
export interface VoiceRecordingState {
  isRecording: boolean;
  isPlaying: boolean;
  hasRecorded: boolean;
  // 녹음 시작/정지가 처리되는 동안(네이티브 백그라운드 스레드) 버튼을 잠깐 막음
  isBusy: boolean;
  onRecord: () => void;
  onPlay: () => void;
  onDelete: () => void;
}

const MICROPHONE_SETTINGS_MESSAGE = '마이크 권한이 꺼져 있어요. 설정에서 마이크 권한을 허용해 주세요.';

function alertOpenSettings(message: string) {
  showNotice('', message, [
    { text: '취소', style: 'cancel' },
    { text: '설정 열기', onPress: () => Linking.openSettings() },
  ]);
}

async function requestMicrophonePermission() {
  // iOS는 녹음을 처음 시작할 때 시스템이 Info.plist(NSMicrophoneUsageDescription) 문구로 직접 물어봄
  // — 거부된 상태면 startRecorder가 실패하므로 그쪽(handleRecord catch)에서 안내함
  if (Platform.OS !== 'android') return true;
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
    title: '마이크 권한',
    message: '어르신께 들려드릴 음성 안내를 녹음하려면 마이크 권한이 필요해요.',
    buttonPositive: '허용',
    buttonNegative: '거부',
  });
  if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    alertOpenSettings(MICROPHONE_SETTINGS_MESSAGE);
  } else if (result === PermissionsAndroid.RESULTS.DENIED) {
    // 이번에만 거부한 경우 — 아무 반응 없이 끝나면 버튼이 고장 난 것처럼 보여서 이유를 알려줌
    showNotice('', '마이크 권한을 허용해야 음성을 녹음할 수 있어요.');
  }
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

// 복약/일정 등록 모달의 "보호자 음성 녹음" — 녹음·재생·삭제 + 저장 시 서버 업로드.
// 녹음 파일은 기기에만 있다가 저장할 때(resolveVoiceFileUrl) 한 번 업로드해서 URL로 바꿈
// → 녹음만 하고 모달을 닫으면 서버에 불필요한 파일이 쌓이지 않음.
// 수정 모달에서는 이미 서버에 있는 녹음(savedUrl)을 그대로 재생·유지할 수 있음.
// TODO(백엔드): 다시 녹음해 저장하거나 삭제해도 이전 파일은 서버 저장소(Firebase Storage)에 그대로 남음 —
// 음성 파일 삭제 API가 없어서 앱에서는 지울 방법이 없음. 백엔드에서 스케줄 수정/삭제 시 이전 파일을 정리해야 함.
export function useVoiceRecording() {
  // useRef(createSound())는 첫 값만 쓰고 버리지만 createSound() 자체는 렌더마다 실행돼 네이티브 객체가 계속 생김
  // — lazy 초기화로 처음 한 번만 만듦
  const [sound] = useState(createSound);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  // 녹음 시작/정지가 네이티브 백그라운드 스레드에서 처리돼 잠깐 걸리므로 그동안 버튼 연타를 막는 용도
  const [isBusy, setIsBusy] = useState(false);
  const [localPath, setLocalPath] = useState<string | null>(null);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  const hasRecorded = !!localPath || !!savedUrl;

  const stopPlayback = async () => {
    sound.removePlaybackEndListener();
    await sound.stopPlayer().catch(() => {});
    setIsPlaying(false);
  };

  // 모달이 닫히거나 화면을 벗어나면 녹음·재생을 멈춤
  useEffect(() => {
    return () => {
      sound.removePlaybackEndListener();
      sound.stopRecorder().catch(() => {});
      sound.stopPlayer().catch(() => {});
    };
  }, [sound]);

  // 모달이 닫힐 때 호출 — 모달은 숨겨질 뿐 언마운트되지 않아서 언마운트 정리(useEffect cleanup)만으로는
  // 녹음 중에 닫으면 마이크 녹음이 백그라운드에서 계속됐음. 네이티브 쪽 정지는 이미 멈춰 있어도 안전함(idempotent)
  const stop = () => {
    sound.removePlaybackEndListener();
    sound.stopRecorder().catch(() => {});
    sound.stopPlayer().catch(() => {});
    setIsRecording(false);
    setIsPlaying(false);
  };

  // 모달을 새로 열 때 호출 — 수정 모달이면 기존에 저장된 녹음 URL을 넘김
  const reset = (initialUrl?: string | null) => {
    if (isRecording) sound.stopRecorder().catch(() => {});
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
        const path = await sound.stopRecorder();
        setIsRecording(false);
        setLocalPath(path);
        return;
      }
      if (!(await requestMicrophonePermission())) return;
      if (isPlaying) await stopPlayback();
      await sound.startRecorder();
      setIsRecording(true);
    } catch (error) {
      console.error('[useVoiceRecording] 녹음 실패', error);
      setIsRecording(false);
      if (Platform.OS === 'ios') {
        // iOS는 권한 상태를 미리 알 방법이 없어서(별도 권한 라이브러리 없음) 실패 시 권한 가능성을 함께 안내
        alertOpenSettings('녹음을 시작하지 못했어요. 마이크 권한이 꺼져 있다면 설정에서 허용해 주세요.');
      } else {
        showNotice('', '녹음을 시작하지 못했어요. 잠시 후 다시 시도해 주세요.');
      }
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
      showNotice('', '재생할 녹음이 없습니다.');
      return;
    }
    try {
      sound.addPlaybackEndListener(() => {
        sound.removePlaybackEndListener();
        setIsPlaying(false);
      });
      await sound.startPlayer(source);
      setIsPlaying(true);
    } catch (error) {
      console.error('[useVoiceRecording] 재생 실패', error);
      setIsPlaying(false);
      showNotice('', '녹음을 재생하지 못했어요.');
    }
  };

  const handleDeleteRecording = async () => {
    if (isBusy) return;
    if (isRecording) {
      await sound.stopRecorder().catch(() => {});
      setIsRecording(false);
    }
    if (isPlaying) await stopPlayback();
    setLocalPath(null);
    setSavedUrl(null);
  };

  // 복약·일정 폼 공통 저장 전 검사 — 통과하지 못하면 안내를 띄우고 false
  const validateBeforeSave = (soundType: SoundType) => {
    if (soundType === 'voice' && !hasRecorded) {
      showNotice('', '보호자 음성을 녹음해주세요.');
      return false;
    }
    if (isRecording) {
      showNotice('', '녹음을 정지한 뒤 저장해주세요.');
      return false;
    }
    return true;
  };

  // 저장 직전에 호출 — 기본 알림음(TTS)이면 빈 문자열, 보호자 음성이면 새로 녹음한 걸 업로드해서 URL을
  // (새 녹음이 없으면 기존 URL을) 돌려줌. 업로드 실패는 그대로 던져서 저장 자체를 실패 처리하게 함
  const resolveVoiceFileUrl = async (soundType: SoundType): Promise<string> => {
    if (soundType !== 'voice') return '';
    if (localPath) {
      const url = await uploadVoiceFileApi(localPath);
      setSavedUrl(url);
      setLocalPath(null);
      return url;
    }
    return savedUrl ?? '';
  };

  // 녹음 UI(SoundSettingsCard)에 그대로 넘기는 묶음
  const controls: VoiceRecordingState = {
    isRecording,
    isPlaying,
    hasRecorded,
    isBusy,
    onRecord: handleRecord,
    onPlay: handlePlay,
    onDelete: handleDeleteRecording,
  };

  return {
    controls,
    reset,
    stop,
    validateBeforeSave,
    resolveVoiceFileUrl,
  };
}
