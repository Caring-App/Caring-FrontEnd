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

// 네이버 로그인(NAVER_CLIENT_ID/SECRET)과는 별개로, NCP 콘솔에서 지도 SDK와 같은 Application에
// Maps > Geocoding 서비스를 활성화하고 그 Client ID/Secret을 .env에 NCP_GEOCODING_KEY_ID /
// NCP_GEOCODING_KEY로 넣어야 동작함. 주소 문자열만 처리하고 상호/기관명은 못 찾음 —
// 장소명 검색은 @shared/ui의 AddressSearchModal(다음 우편번호)이 담당하고, 여기선 그 결과 주소를
// 좌표로 변환하는 용도로만 씀.
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
