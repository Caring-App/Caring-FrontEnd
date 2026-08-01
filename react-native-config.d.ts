declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_WEB_CLIENT_ID?: string;
    NAVER_CLIENT_ID?: string;
    NAVER_CLIENT_SECRET?: string;
    API_BASE_URL?: string;
    NAVER_MAP_CLIENT_ID?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
