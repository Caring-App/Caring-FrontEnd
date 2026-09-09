// "자주 가는 장소" — 어르신 1명에 여러 개 등록 가능. 위치 좌표(latitude/longitude)를 필수로 받으므로
// 현재는 UI(지도에서 좌표 선택)가 없어 이 타입/스토어만 준비해두고, 화면 연동은 별도 작업으로 남겨둠.
export interface Place {
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
}

export interface PlaceRequest {
  wardId: number;
  placeName: string;
  latitude: number;
  longitude: number;
}
