import axios from 'axios';

// axios 에러를 그대로 console.error에 넘기면 error.config.data(요청 바디)까지 통째로 로그에 찍혀서
// 비밀번호·액세스토큰 같은 민감정보가 콘솔/logcat에 평문으로 남을 수 있음.
// 요청 바디는 빼고 진단에 필요한 최소 정보(메시지/상태코드/URL)만 남기기 위한 래퍼.
export function logApiError(context: string, error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error(context, {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
    });
    return;
  }
  console.error(context, error);
}
