import { create } from 'zustand';
import { logApiError } from '@shared/api';
import { createPlaceApi, deletePlaceApi, getPlacesApi } from '../api/placeApi';
import { Place } from './placeTypes';

interface PlaceState {
  placesByWard: Record<string, Place[]>;
  isLoading: boolean;
  fetchPlaces: (wardId: string) => Promise<void>;
  addPlace: (wardId: string, placeName: string, latitude: number, longitude: number) => Promise<void>;
  deletePlace: (wardId: string, placeId: number) => Promise<void>;
}

export const usePlaceStore = create<PlaceState>((set) => ({
  placesByWard: {},
  isLoading: false,

  fetchPlaces: async wardId => {
    set({ isLoading: true });
    try {
      const places = await getPlacesApi(Number(wardId));
      set(state => ({ placesByWard: { ...state.placesByWard, [wardId]: places } }));
    } catch (error) {
      logApiError('자주 가는 장소 목록 조회 실패', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addPlace: async (wardId, placeName, latitude, longitude) => {
    const created = await createPlaceApi({ wardId: Number(wardId), placeName, latitude, longitude });
    set(state => ({
      placesByWard: { ...state.placesByWard, [wardId]: [...(state.placesByWard[wardId] ?? []), created] },
    }));
  },

  deletePlace: async (wardId, placeId) => {
    await deletePlaceApi(placeId);
    set(state => ({
      placesByWard: {
        ...state.placesByWard,
        [wardId]: (state.placesByWard[wardId] ?? []).filter(place => place.placeId !== placeId),
      },
    }));
  },
}));
