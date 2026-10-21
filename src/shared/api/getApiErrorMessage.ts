import axios from 'axios';

// 백엔드 GlobalExceptionHandler가 주는 에러 응답({ status, message })에서 사용자에게 보여줄 메시지를 꺼냄.
// 서버 메시지가 없으면(네트워크 오류 등) undefined — 호출하는 쪽에서 기본 문구로 대체할 것.
export function getApiErrorMessage(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const message = error.response?.data?.message;
  return typeof message === 'string' && message.length > 0 ? message : undefined;
}
