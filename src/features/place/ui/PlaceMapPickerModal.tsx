import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NaverMapView, NaverMapMarkerOverlay, NaverMapViewRef } from '@mj-studio/react-native-naver-map';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { FormLabel } from '@shared/ui';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCoord, setSelectedCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const center = initialCenter ?? DEFAULT_CENTER;

  const reset = () => {
    setPlaceName('');
    setSearchQuery('');
    setSelectedCoord(null);
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }
    reset();
    onClose();
  };

  const handleSearch = async () => {
    if (isSearching || !searchQuery.trim()) {
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchAddressApi(searchQuery.trim());
      if (results.length === 0) {
        Alert.alert('', '검색 결과가 없어요. 다른 주소나 장소명으로 시도해주세요.');
        return;
      }
      const [first] = results;
      setSelectedCoord({ latitude: first.latitude, longitude: first.longitude });
      mapRef.current?.animateCameraTo({ latitude: first.latitude, longitude: first.longitude, zoom: 17 });
    } catch (error) {
      logApiError('주소 검색 실패', error);
      Alert.alert('', '주소 검색에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSearching(false);
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

        <View className="flex-row gap-2 border-b border-border px-4 py-3">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholder="주소나 장소명으로 검색"
            placeholderTextColor="#6C757D"
            className="flex-1 rounded-md border border-border-input px-3.5 py-2 font-pretendard text-lg text-text-primary"
          />
          <Pressable
            onPress={handleSearch}
            disabled={isSearching}
            className={`items-center justify-center rounded-md bg-primary px-4 ${isSearching ? 'opacity-60' : ''}`}>
            {isSearching ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Text className="font-pretendard-semibold text-lg text-white">검색</Text>
            )}
          </Pressable>
        </View>

        {/* 모달이 열려있을 때만 마운트 — 닫힌 상태에서도 지도를 살려두면 불필요한 리소스를 씀 */}
        {visible && (
          <NaverMapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialCamera={{ latitude: center.latitude, longitude: center.longitude, zoom: 15 }}
            onTapMap={({ latitude, longitude }) => setSelectedCoord({ latitude, longitude })}>
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
                placeholderTextColor="#6C757D"
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
    </Modal>
  );
}
