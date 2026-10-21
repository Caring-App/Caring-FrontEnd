import { useRef, useState } from 'react';
import { logApiError } from '@shared/api';
import { showNotice } from '@shared/model';
import type { AddressSearchResult } from '@shared/ui';
import { searchAddressApi } from '../api/geocodeApi';
import { Place } from './placeTypes';
import { usePlaceStore } from './usePlaceStore';

type Coord = { latitude: number; longitude: number };

// 장소 추가 모달(PlaceMapPickerModal)의 상태와 동작 — 주소 검색 → 좌표 변환, 지도 탭으로 위치 선택, 저장.
// 지도 카메라 이동은 화면이 가진 지도 ref로 해야 해서 onLocated로 화면에 넘김
export function usePlaceMapPicker({
  wardId,
  onClose,
  onCreated,
  onLocated,
}: {
  wardId: string;
  onClose: () => void;
  onCreated: (place: Place) => void;
  onLocated: (coord: Coord) => void;
}) {
  const [placeName, setPlaceName] = useState('');
  const [isAddressSearchVisible, setIsAddressSearchVisible] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<Coord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 지오코딩 요청이 끝나기 전에 지도를 다시 탭하거나 모달을 닫아버리면, 나중에 도착하는 응답이 그 사이
  // 바뀐(또는 이미 닫혀서 리셋된) 상태를 덮어쓸 수 있음 — 매번 값을 올리고, 응답이 도착했을 때 그 사이
  // 값이 안 바뀌었는지 확인해서 지금 요청이 여전히 최신인 경우에만 반영함.
  const requestIdRef = useRef(0);

  const reset = () => {
    requestIdRef.current += 1;
    setPlaceName('');
    setSelectedCoord(null);
  };

  const close = () => {
    if (isSubmitting) {
      return;
    }
    reset();
    onClose();
  };

  const selectCoordOnMap = (coord: Coord) => {
    requestIdRef.current += 1;
    setSelectedCoord(coord);
  };

  // 다음 우편번호 서비스는 주소만 주고 좌표는 안 줘서, 고른 주소를 다시 NCP Geocoding에 넣어 좌표를 얻음.
  const selectAddress = async (result: AddressSearchResult) => {
    const requestId = ++requestIdRef.current;
    setIsGeocoding(true);
    try {
      const [geocoded] = await searchAddressApi(result.address);
      if (requestId !== requestIdRef.current) {
        return;
      }
      if (!geocoded) {
        showNotice('', '이 주소의 좌표를 찾지 못했어요. 지도를 눌러 직접 위치를 선택해주세요.');
        return;
      }
      const coord = { latitude: geocoded.latitude, longitude: geocoded.longitude };
      setSelectedCoord(coord);
      onLocated(coord);
      if (!placeName.trim()) {
        setPlaceName(result.buildingName || result.address);
      }
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      logApiError('주소 지오코딩 실패', error);
      showNotice('', '좌표를 찾는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      if (requestId === requestIdRef.current) {
        setIsGeocoding(false);
      }
    }
  };

  const save = async () => {
    if (isSubmitting) {
      return;
    }
    if (!placeName.trim()) {
      showNotice('', '장소 이름을 입력해주세요.');
      return;
    }
    if (!selectedCoord) {
      showNotice('', '주소를 검색하거나 지도를 눌러 위치를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await usePlaceStore
        .getState()
        .addPlace(wardId, placeName.trim(), selectedCoord.latitude, selectedCoord.longitude);
      onCreated(created);
      reset();
      onClose();
    } catch (error) {
      logApiError('장소 등록 실패', error);
      showNotice('', '장소 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: { placeName, isAddressSearchVisible, isGeocoding, selectedCoord, isSubmitting },
    actions: {
      setPlaceName,
      openAddressSearch: () => setIsAddressSearchVisible(true),
      closeAddressSearch: () => setIsAddressSearchVisible(false),
      selectAddress,
      selectCoordOnMap,
      close,
      save,
    },
  };
}
