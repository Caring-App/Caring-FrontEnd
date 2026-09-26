import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@shared/theme/colors';
import { AddressSearchModal, AddressSearchResult } from './AddressSearchModal';

interface AddressInputProps {
  baseAddress: string;
  detailAddress: string;
  onChangeBaseAddress: (value: string) => void;
  onChangeDetailAddress: (value: string) => void;
  // 화면마다 입력창 스타일이 달라서(회원가입 폼 / 돌봄대상자 정보 수정) 호출부에서 받음.
  // RN은 View의 글자 스타일이 안의 Text로 상속되지 않아서 박스(테두리·패딩)와 글자 스타일을 나눠 받음
  boxClassName: string;
  textClassName: string;
}

// 기본 주소는 다음 우편번호 검색으로만 고르고(직접 입력 불가), 상세 주소만 직접 입력받는 주소 입력.
// 백엔드가 baseAddress를 카카오 지오코딩으로 좌표 변환해 저장하는데(주변 복지 시설 조회 등에 쓰임),
// 자유 입력 주소는 변환에 실패하는 경우가 많아 검색 결과(도로명 주소)만 받도록 함.
export function AddressInput({
  baseAddress,
  detailAddress,
  onChangeBaseAddress,
  onChangeDetailAddress,
  boxClassName,
  textClassName,
}: AddressInputProps) {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // 다른 기본 주소를 고르면 이전 주소 기준으로 입력한 상세 주소(동·호수)는 맞지 않으므로 비움
  const handleSelect = (result: AddressSearchResult) => {
    if (result.address !== baseAddress) {
      onChangeDetailAddress('');
    }
    onChangeBaseAddress(result.address);
  };

  return (
    <View className="gap-2">
      <Pressable onPress={() => setIsSearchVisible(true)} className={boxClassName}>
        <Text className={textClassName} style={baseAddress ? undefined : styles.placeholder} numberOfLines={2}>
          {baseAddress || '도로명 주소 검색'}
        </Text>
      </Pressable>
      {/* 상세 주소는 기본 주소에 붙는 값이라 기본 주소를 고른 뒤에만 입력받음 */}
      {!!baseAddress && (
        <TextInput
          className={`${boxClassName} ${textClassName}`}
          placeholder="상세 주소 (동·호수 등, 선택)"
          placeholderTextColor={colors.textPlaceholder}
          value={detailAddress}
          onChangeText={onChangeDetailAddress}
        />
      )}

      <AddressSearchModal
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        onSelect={handleSelect}
      />
    </View>
  );
}

// 글자 색은 textClassName에도 들어있어서 className으로 덮으면 우선순위가 불명확함 — style로 확실히 덮어씀
const styles = StyleSheet.create({
  placeholder: { color: colors.textPlaceholder },
});
