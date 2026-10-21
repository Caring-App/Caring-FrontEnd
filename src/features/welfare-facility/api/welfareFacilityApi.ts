import axios from 'axios';
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

// 어르신 좌표가 없을 때(주소 미등록이거나 가입 시 주소→좌표 변환 실패) 백엔드가 주는 400 메시지.
// 권한 없음 등 다른 400과 구분하려고 메시지까지 비교함(백엔드 WelfareFacilityService 참고)
const WARD_COORDINATES_MISSING_MESSAGE = '대상자의 좌표 정보가 없어 근처 시설을 조회할 수 없습니다.';

export function isWardCoordinatesMissingError(error: unknown): boolean {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 400 &&
    error.response.data?.message === WARD_COORDINATES_MISSING_MESSAGE
  );
}
