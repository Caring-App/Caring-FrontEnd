import type { WelfareFacility, WelfareFacilityResponse } from '../model/types';

// 공공데이터 원본은 빈 문자열/공백으로 오는 경우도 있어서 null로 통일
function emptyToNull(value: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function toWelfareFacility(response: WelfareFacilityResponse): WelfareFacility {
  return {
    id: `${response.fcltNm}|${response.address ?? ''}`,
    name: response.fcltNm,
    address: emptyToNull(response.address),
    phone: emptyToNull(response.telNo),
    operator: emptyToNull(response.cprNm),
    homepage: emptyToNull(response.homepageAddr),
    distanceKm: response.distanceKm,
  };
}

// 1km 미만은 m 단위로(예: 0.35 → "350m"), 그 이상은 소수 첫째 자리 km로(예: 1.24 → "1.2km")
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)}m`;
  return `${distanceKm.toFixed(1)}km`;
}

// 공공데이터 홈페이지 주소는 "www.xxx.or.kr"처럼 scheme 없이 오는 경우가 많아 Linking으로 열리도록 보정
export function toHomepageUrl(homepage: string): string {
  return /^https?:\/\//i.test(homepage) ? homepage : `http://${homepage}`;
}
