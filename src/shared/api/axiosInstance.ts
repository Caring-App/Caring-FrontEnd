import axios from 'axios';
import Config from 'react-native-config';
import { useSessionStore } from '@shared/store/useSessionStore';
// index(@shared/model)를 거치면 useVoiceRecording → voiceApi → 이 파일로 순환 참조가 생겨 파일을 직접 가져옴
import { notifySessionExpired } from '@shared/model/useNoticeStore';
import { getAccessToken, getRefreshToken, setAccessToken } from './tokenStorage';

export const axiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    try {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('토큰 가져오기 실패:', error);
    }
    return config;
  },
  error => Promise.reject(error),
);

// 액세스 토큰 만료 시 refreshToken으로 재발급 후 원래 요청을 재시도.
// 동시에 여러 요청이 만료를 맞아도 재발급은 한 번만 일어나도록 대기열로 묶어서 처리.
let isRefreshing = false;

// 서버가 아닌 네트워크 장비(회사·학교 Wi‑Fi 방화벽 등)가 돌려준 HTML 차단 페이지인지 — 이런 403은 토큰과 무관함
function isHtmlResponse(data: unknown) {
  return typeof data === 'string' && data.trimStart().startsWith('<');
}

// 토큰 만료로 볼 응답인지 — 백엔드(Spring Security)는 만료·무효 토큰을 인증 실패로만 넘기고 별도 401 처리가 없어서
// 기본값인 403을 줌. 이 백엔드는 역할별 접근 제한이 없고 권한 오류(연결 안 된 어르신 등)는 400으로 주므로,
// 토큰을 실어 보낸 요청의 403은 사실상 "토큰 만료/무효"임. 토큰 없이 보낸 요청의 403은 재발급으로 해결되지 않아 제외.
// TODO(백엔드): SecurityConfig에 AuthenticationEntryPoint로 401을 주게 되면 403 조건은 제거
function isAuthExpiredResponse(error: {
  response?: { status?: number; data?: unknown };
  config?: { headers?: Record<string, unknown> };
}) {
  const status = error.response?.status;
  if (status === 401) return true;
  return status === 403 && !!error.config?.headers?.Authorization && !isHtmlResponse(error.response?.data);
}

// refreshToken이 없어서 재발급을 시도할 수 없을 때
class NoRefreshTokenError extends Error {}

// 재발급 실패가 "세션이 정말 끝났다"는 뜻인지 — 저장된 refreshToken이 없거나, 서버가 refreshToken을 거절한 경우
// (만료·무효는 400 "유효하지 않은 토큰입니다."). 인터넷 끊김·타임아웃·서버 오류(5xx)·네트워크 장비 차단은
// 잠깐의 문제라 로그아웃시키지 않음 — 안 그러면 네트워크가 잠깐 끊기기만 해도 로그인이 풀림
export function isRefreshRejected(error: unknown) {
  if (error instanceof NoRefreshTokenError) return true;
  if (!axios.isAxiosError(error) || !error.response) return false;
  const { status, data } = error.response;
  return (status === 400 || status === 401 || status === 403) && !isHtmlResponse(data);
}

// 저장된 refreshToken으로 accessToken을 새로 발급받아 저장함 — 인터셉터와 앱 시작 시 세션 복원(restoreSession)이 같이 씀.
// 인터셉터를 다시 타지 않도록 axiosInstance가 아닌 axios로 직접 호출
export async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new NoRefreshTokenError('저장된 refreshToken이 없습니다.');
  const { data } = await axios.post<{ accessToken: string }>(
    `${Config.API_BASE_URL}/api/auth/refresh`,
    { refreshToken },
    { timeout: 5000 },
  );
  await setAccessToken(data.accessToken);
  return data.accessToken;
}

let pendingRequests: Array<(accessToken: string | null) => void> = [];

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      !isAuthExpiredResponse(error) ||
      originalRequest?._retry ||
      originalRequest?.url === '/api/auth/refresh'
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push(accessToken => {
          if (!accessToken) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const accessToken = await refreshAccessToken();

      pendingRequests.forEach(resolvePending => resolvePending(accessToken));
      pendingRequests = [];

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      pendingRequests.forEach(resolvePending => resolvePending(null));
      pendingRequests = [];
      if (!isRefreshRejected(refreshError)) {
        // 네트워크 문제 등으로 재발급 자체를 못 한 경우 — 세션은 유지하고 원래 요청만 실패로 돌려보냄
        return Promise.reject(error);
      }
      // refreshToken도 만료/무효인 경우 재로그인이 필요하므로 세션을 완전히 종료하고, 갑자기 로그인 화면으로
      // 바뀐 이유를 알려줌(로그아웃 시 안내 대기열이 비워진 뒤에 넣어야 남음)
      const wasLoggedIn = useSessionStore.getState().isLoggedIn;
      useSessionStore.getState().logout();
      if (wasLoggedIn) notifySessionExpired();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
