// GET /api/location/{wardId}/latest 응답 형태.
export interface WardLocation {
  locationId: number;
  latitude: number;
  longitude: number;
  stayDuration: number;
  recordedAt: string;
  isVisitVerified: boolean;
}
