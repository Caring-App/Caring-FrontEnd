import axios from 'axios';
import Config from 'react-native-config';

export interface GeocodeResult {
  address: string;
  latitude: number;
  longitude: number;
}

interface NaverGeocodeAddress {
  roadAddress?: string;
  jibunAddress?: string;
  x: string; // longitude
  y: string; // latitude
}

interface NaverGeocodeResponse {
  status: string;
  addresses: NaverGeocodeAddress[];
}

const GEOCODE_URL = 'https://maps.apigw.ntruss.com/map-geocode/v2/geocode';

// 네이버 로그인(NAVER_CLIENT_ID/SECRET)과는 별개로, NCP 콘솔에서 Maps > Geocoding 서비스를 활성화하고
// 발급받은 Client ID/Secret이 필요함. .env에 NCP_GEOCODING_KEY_ID / NCP_GEOCODING_KEY로 추가해야 동작함
// (미발급 상태라 실제 응답 형식을 검증하진 못했음 — NCP 공식 문서 기준으로 작성).
// 앱 자체 백엔드(axiosInstance)가 아니라 네이버 서버를 직접 호출하는 요청이라 별도 axios 인스턴스를 씀.
export const searchAddressApi = async (query: string): Promise<GeocodeResult[]> => {
  const { data } = await axios.get<NaverGeocodeResponse>(GEOCODE_URL, {
    params: { query },
    headers: {
      'X-NCP-APIGW-API-KEY-ID': Config.NCP_GEOCODING_KEY_ID,
      'X-NCP-APIGW-API-KEY': Config.NCP_GEOCODING_KEY,
    },
  });
  return (data.addresses ?? []).map(item => ({
    address: item.roadAddress || item.jibunAddress || '',
    latitude: Number(item.y),
    longitude: Number(item.x),
  }));
};
