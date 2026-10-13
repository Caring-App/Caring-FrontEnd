import React, { useRef } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { NaverMapView, NaverMapMarkerOverlay, NaverMapViewRef } from '@mj-studio/react-native-naver-map';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import SearchIcon from '@assets/icons/action/search.svg';
import { AddressSearchModal, FormLabel } from '@shared/ui';
import { colors } from '@shared/theme/colors';
import { Place } from '../model/placeTypes';
import { usePlaceMapPicker } from '../model/usePlaceMapPicker';

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
  const { state, actions } = usePlaceMapPicker({
    wardId,
    onClose,
    onCreated,
    onLocated: coord => mapRef.current?.animateCameraTo({ ...coord, zoom: 17 }),
  });

  const center = initialCenter ?? DEFAULT_CENTER;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={actions.close}>
      <View className="flex-1 bg-surface">
        <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
          <Pressable onPress={actions.close} hitSlop={8} className="-rotate-180">
            <ChevronRightIcon width={18} height={18} />
          </Pressable>
          <Text className="text-md font-bold text-text-primary">장소 추가</Text>
        </View>

        <View className="border-b border-border px-4 py-3">
          <Pressable
            onPress={actions.openAddressSearch}
            disabled={state.isGeocoding}
            className={`flex-row items-center justify-center gap-1.5 rounded-md border border-border-input py-2.5 ${
              state.isGeocoding ? 'opacity-60' : ''
            }`}>
            {state.isGeocoding ? (
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
            onTapMap={({ latitude, longitude }) => actions.selectCoordOnMap({ latitude, longitude })}>
            {state.selectedCoord && (
              <NaverMapMarkerOverlay latitude={state.selectedCoord.latitude} longitude={state.selectedCoord.longitude} />
            )}
          </NaverMapView>
        )}

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="gap-3 border-t border-border px-4 py-4">
            <View>
              <FormLabel>장소 이름</FormLabel>
              <TextInput
                value={state.placeName}
                onChangeText={actions.setPlaceName}
                placeholder="장소 이름을 입력하세요"
                placeholderTextColor={colors.textPlaceholder}
                className="rounded-md border border-border-input px-3.5 py-2 font-pretendard text-lg text-text-primary"
              />
            </View>
            <Text className="font-pretendard text-sm text-text-muted">
              {state.selectedCoord
                ? '위치를 선택했어요. 지도를 다시 누르면 위치가 바뀌어요.'
                : '주소를 검색하거나 지도를 눌러 위치를 선택해주세요.'}
            </Text>
            <Pressable
              onPress={actions.save}
              disabled={state.isSubmitting}
              className={`items-center justify-center rounded-md bg-primary py-4 ${
                state.isSubmitting ? 'opacity-60' : ''
              }`}>
              {state.isSubmitting ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text className="font-pretendard-semibold text-xl text-white">저장하기</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>

      <AddressSearchModal
        visible={state.isAddressSearchVisible}
        onClose={actions.closeAddressSearch}
        onSelect={actions.selectAddress}
      />
    </Modal>
  );
}
