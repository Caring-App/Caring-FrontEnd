import axios from 'axios';
import Config from 'react-native-config';
import { useSessionStore } from '@shared/store/useSessionStore';
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
      console.error('토큰 가져오기 실패:', error);
    }
    return config;
  },
  error => Promise.reject(error),
);

// 액세스 토큰 만료(401) 시 refreshToken으로 재발급 후 원래 요청을 재시도.
// 동시에 여러 요청이 401을 맞아도 재발급은 한 번만 일어나도록 대기열로 묶어서 처리.
let isRefreshing = false;
let pendingRequests: Array<(accessToken: string | null) => void> = [];

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
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
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        throw error;
      }

      const { data } = await axios.post(`${Config.API_BASE_URL}/api/auth/refresh`, { refreshToken });
      await setAccessToken(data.accessToken);

      pendingRequests.forEach(resolvePending => resolvePending(data.accessToken));
      pendingRequests = [];

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      pendingRequests.forEach(resolvePending => resolvePending(null));
      pendingRequests = [];
      // refreshToken도 만료/무효인 경우 재로그인이 필요하므로 세션을 완전히 종료
      useSessionStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
