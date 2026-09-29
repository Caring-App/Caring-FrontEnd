import axios from 'axios';

// axios 에러를 그대로 로그에 넘기면 error.config.data(요청 바디)까지 통째로 찍혀서
// 비밀번호·액세스토큰 같은 민감정보가 콘솔/logcat에 평문으로 남을 수 있음.
// 요청 바디는 빼고 진단에 필요한 최소 정보(메시지/상태코드/URL/서버 메시지)만 남기기 위한 래퍼.
// console.error는 개발 빌드에서 화면에 빨간 알림(LogBox)으로 떠서 console.log로 남김 —
// 사용자에게 알려야 하는 실패는 NoticeModal(showNotice / notifyLoadFailed)로 따로 안내함.
// 로그는 Metro 터미널·logcat(ReactNativeJS)에서 그대로 확인 가능
export function logApiError(context: string, error: unknown) {
  if (axios.isAxiosError(error)) {
    console.log(context, {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      serverMessage: error.response?.data?.message,
    });
    return;
  }
  console.log(context, error);
}
