import { axiosInstance } from './axiosInstance';

// 음성 파일은 기본 5초 타임아웃으로는 업로드가 끝나기 전에 끊길 수 있어 넉넉히 둠
const VOICE_UPLOAD_TIMEOUT_MS = 30000;

const toFileUri = (path: string) => (path.startsWith('file://') ? path : `file://${path}`);

// [보호자 음성 녹음 업로드] POST /api/voice/upload (multipart, 필드명 file) → 응답의 voiceFileUrl을
// 복약/일정 스케줄 등록 시 voiceFileUrl로 보냄. 복약·일정이 같이 쓰는 API라 shared에 둠
export const uploadVoiceFileApi = async (localPath: string): Promise<string> => {
  const uri = toFileUri(localPath);
  const extension = uri.split('.').pop() || 'm4a';
  const formData = new FormData();
  formData.append('file', { uri, name: `voice.${extension}`, type: 'audio/mp4' } as unknown as Blob);

  const { data } = await axiosInstance.post<{ voiceFileUrl: string }>('/api/voice/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: VOICE_UPLOAD_TIMEOUT_MS,
  });
  return data.voiceFileUrl;
};
