import axios from 'axios';
import { axiosInstance } from './axiosInstance';

// 음성 파일은 기본 5초 타임아웃으로는 업로드가 끝나기 전에 끊길 수 있어 넉넉히 둠
const VOICE_UPLOAD_TIMEOUT_MS = 30000;

const toFileUri = (path: string) => (path.startsWith('file://') ? path : `file://${path}`);

// [보호자 음성 녹음 업로드] POST /api/voice/upload (multipart, 필드명 file) → 응답의 voiceFileUrl을
// 복약/일정 스케줄 등록 시 voiceFileUrl로 보냄. 복약·일정이 같이 쓰는 API라 shared에 둠
const postVoiceFile = async (uri: string, extension: string) => {
  const formData = new FormData();
  formData.append('file', { uri, name: `voice.${extension}`, type: 'audio/mp4' } as unknown as Blob);

  const { data } = await axiosInstance.post<{ voiceFileUrl: string }>('/api/voice/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: VOICE_UPLOAD_TIMEOUT_MS,
  });
  return data.voiceFileUrl;
};

// Android(OkHttp)는 쉬는 동안 서버·통신망이 끊어 둔 연결을 재사용하다 실패하면 새 연결로 요청을 자동 재시도하는데,
// RN은 파일을 한 번만 읽을 수 있는 스트림으로 보내서 재시도 때 "Stream Closed"로 실패함(JSON 요청은 재시도가 성공해서
// 기본 알림음 저장은 되고 녹음 업로드만 실패하던 원인). 응답 없이 실패하면 파일을 새로 열어 한 번 더 보냄.
// 단 타임아웃·취소는 재시도하지 않음 — 이미 30초를 기다렸고, 첫 요청이 서버에 도착했을 수도 있어 파일이 중복 업로드될 수 있음
const NO_RETRY_ERROR_CODES = ['ECONNABORTED', 'ETIMEDOUT', 'ERR_CANCELED'];

export const uploadVoiceFileApi = async (localPath: string): Promise<string> => {
  const uri = toFileUri(localPath);
  const extension = uri.split('.').pop() || 'm4a';
  try {
    return await postVoiceFile(uri, extension);
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response || NO_RETRY_ERROR_CODES.includes(error.code ?? '')) throw error;
    return postVoiceFile(uri, extension);
  }
};
