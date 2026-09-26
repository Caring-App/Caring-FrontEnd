import { axiosInstance } from '@shared/api/axiosInstance';
import { WelfareFacilityResponse } from '../model/types';

// [주변 공공 복지 시설 조회] — 보호자 전용. 어르신 회원 정보에 등록된 주소(기기 GPS 아님) 기준으로
// radiusKm 반경 안의 시설을 가까운 순으로 돌려줌. 어르신 좌표가 없으면 400.
// 처음 조회하는 지역은 백엔드가 공공데이터 API 호출 + 주소→좌표 변환까지 해서 응답이 수 초 걸릴 수 있음.
export const getNearbyWelfareFacilitiesApi = async (
  wardId: number,
  radiusKm?: number,
): Promise<WelfareFacilityResponse[]> => {
  const { data } = await axiosInstance.get<WelfareFacilityResponse[]>('/api/welfare-facility', {
    params: { wardId, radiusKm },
  });
  return data;
};
