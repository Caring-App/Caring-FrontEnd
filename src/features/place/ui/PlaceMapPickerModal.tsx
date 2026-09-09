import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { NaverMapView, NaverMapMarkerOverlay, NaverMapViewRef } from '@mj-studio/react-native-naver-map';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import SearchIcon from '@assets/icons/action/search.svg';
import { AddressSearchModal, AddressSearchResult, FormLabel } from '@shared/ui';
import { colors } from '@shared/theme/colors';
import { logApiError } from '@shared/api';
import { searchAddressApi } from '../api/geocodeApi';
import { usePlaceStore } from '../model/usePlaceStore';
import { Place } from '../model/placeTypes';

// 위치 정보가 없을 때(어르신 기기가 아직 위치를 보고한 적 없음 등) 기본으로 보여줄 좌표.
// @features/location의 mock 좌표(서울시청)와 동일한 값을 사용.
const DEFAULT_CENTER = { latitude: 37.5665, longitude: 126.978 };

interface PlaceMapPickerModalProps {
  visible: boolean;
  wardId: string;
  initialCenter?: { latitude: number; longitude: number };
  onClose: () => void;
  onCreated: (place: Place) => void;
}

export function PlaceMapPickerModal({ visible, wardId, initialCenter, onClose, onCreated }: PlaceMapPickerModalProps) {
  const mapRef = useRef<NaverMapViewRef>(null);
  const [placeName, setPlaceName] = useState('');
  const [isAddressSearchVisible, setIsAddressSearchVisible] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const center = initialCenter ?? DEFAULT_CENTER;

  // 지오코딩 요청이 끝나기 전에 지도를 다시 탭하거나 모달을 닫아버리면, 나중에 도착하는 응답이 그 사이
  // 바뀐(또는 이미 닫혀서 리셋된) 상태를 덮어쓸 수 있음 — 매번 값을 올리고, 응답이 도착했을 때 그 사이
  // 값이 안 바뀌었는지 확인해서 지금 요청이 여전히 최신인 경우에만 반영함.
  const requestIdRef = useRef(0);

  const reset = () => {
    requestIdRef.current += 1;
    setPlaceName('');
    setSelectedCoord(null);
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    reset();
    onClose();
  };

  // 다음 우편번호 서비스는 주소만 주고 좌표는 안 줘서, 고른 주소를 다시 NCP Geocoding에 넣어 좌표를 얻음.
  const handleAddressSelected = async (result: AddressSearchResult) => {
    const requestId = ++requestIdRef.current;
    setIsGeocoding(true);
    try {
      const [geocoded] = await searchAddressApi(result.address);
      if (requestId !== requestIdRef.current) {
        return;
      }
      if (!geocoded) {
        Alert.alert('', '이 주소의 좌표를 찾지 못했어요. 지도를 눌러 직접 위치를 선택해주세요.');
        return;
      }
      setSelectedCoord({ latitude: geocoded.latitude, longitude: geocoded.longitude });
      mapRef.current?.animateCameraTo({ latitude: geocoded.latitude, longitude: geocoded.longitude, zoom: 17 });
      if (!placeName.trim()) {
        setPlaceName(result.buildingName || result.address);
      }
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      logApiError('주소 지오코딩 실패', error);
      Alert.alert('', '좌표를 찾는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      if (requestId === requestIdRef.current) {
        setIsGeocoding(false);
      }
    }
  };

  const handleSave = async () => {
    if (isSubmitting) {
      return;
    }
    if (!placeName.trim()) {
      Alert.alert('', '장소 이름을 입력해주세요.');
      return;
    }
    if (!selectedCoord) {
      Alert.alert('', '주소를 검색하거나 지도를 눌러 위치를 선택해주세요.');
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
      Alert.alert('', '장소 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 bg-surface">
        <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
          <Pressable onPress={handleClose} hitSlop={8} className="-rotate-180">
            <ChevronRightIcon width={18} height={18} />
          </Pressable>
          <Text className="text-md font-bold text-text-primary">장소 추가</Text>
        </View>

        <View className="border-b border-border px-4 py-3">
          <Pressable
            onPress={() => setIsAddressSearchVisible(true)}
            disabled={isGeocoding}
            className={`flex-row items-center justify-center gap-1.5 rounded-md border border-border-input py-2.5 ${
              isGeocoding ? 'opacity-60' : ''
            }`}>
            {isGeocoding ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <SearchIcon width={16} height={16} />
                <Text className="font-pretendard-semibold text-lg text-text-primary">주소 검색</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* 모달이 열려있을 때만 마운트 — 닫힌 상태에서도 지도를 살려두면 불필요한 리소스를 씀 */}
        {visible && (
          <NaverMapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialCamera={{ latitude: center.latitude, longitude: center.longitude, zoom: 15 }}
            onTapMap={({ latitude, longitude }) => {
              requestIdRef.current += 1;
              setSelectedCoord({ latitude, longitude });
            }}>
            {selectedCoord && (
              <NaverMapMarkerOverlay latitude={selectedCoord.latitude} longitude={selectedCoord.longitude} />
            )}
          </NaverMapView>
        )}

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="gap-3 border-t border-border px-4 py-4">
            <View>
              <FormLabel>장소 이름</FormLabel>
              <TextInput
                value={placeName}
                onChangeText={setPlaceName}
                placeholder="장소 이름을 입력하세요"
                placeholderTextColor={colors.textPlaceholder}
                className="rounded-md border border-border-input px-3.5 py-2 font-pretendard text-lg text-text-primary"
              />
            </View>
            <Text className="font-pretendard text-sm text-text-muted">
              {selectedCoord
                ? '위치를 선택했어요. 지도를 다시 누르면 위치가 바뀌어요.'
                : '주소를 검색하거나 지도를 눌러 위치를 선택해주세요.'}
            </Text>
            <Pressable
              onPress={handleSave}
              disabled={isSubmitting}
              className={`items-center justify-center rounded-md bg-primary py-4 ${
                isSubmitting ? 'opacity-60' : ''
              }`}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text className="font-pretendard-semibold text-xl text-white">저장하기</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>

      <AddressSearchModal
        visible={isAddressSearchVisible}
        onClose={() => setIsAddressSearchVisible(false)}
        onSelect={handleAddressSelected}
      />
    </Modal>
  );
}
