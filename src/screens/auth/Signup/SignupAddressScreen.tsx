import React, { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useSignupAddress, useSignupExit } from '@features/auth/model';
import { AuthFieldLabel, AuthStepLayout, AuthTextField } from '@features/auth/ui';
import { AddressSearchModal } from '@shared/ui';

// 주소 입력 (Figma 970:7630) — 주소 검색은 일정 관리 장소 추가와 같은 다음(카카오) 우편번호 검색을 씀
export default function SignupAddressScreen() {
  const { baseAddress, detailAddress, setDetailAddress, selectAddress, handleNext, isSubmitting, submitError } =
    useSignupAddress();
  const handleClose = useSignupExit();
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  return (
    <AuthStepLayout
      title="주소를 입력해주세요"
      description="서비스 제공을 위해 정확한 주소를 입력해 주세요."
      onClose={handleClose}
      buttonLabel="다음"
      onPressButton={handleNext}
      buttonDisabled={!baseAddress}
      isLoading={isSubmitting}
      errorMessage={submitError}
    >
      <View className="mt-6 gap-4">
        <View>
          <AuthFieldLabel>주소</AuthFieldLabel>
          <View className="flex-row gap-2">
            <Pressable
              className="min-h-[55px] flex-1 justify-center rounded-card bg-surface-authInput px-4 py-3"
              onPress={() => setIsSearchVisible(true)}
            >
              <Text
                className={`font-pretendard text-md ${baseAddress ? 'text-black' : 'text-text-authPlaceholder'}`}
                numberOfLines={2}
              >
                {baseAddress || '주소를 입력하세요'}
              </Text>
            </Pressable>
            <TouchableOpacity
              className="w-[70px] items-center justify-center rounded-card bg-primary"
              onPress={() => setIsSearchVisible(true)}
              activeOpacity={0.8}
            >
              <Text className="font-pretendard-bold text-base text-white">검색</Text>
            </TouchableOpacity>
          </View>
        </View>

        <AuthTextField
          label="상세 주소"
          placeholder="상세 주소를 입력하세요"
          value={detailAddress}
          onChangeText={setDetailAddress}
          editable={!!baseAddress}
        />
      </View>

      <AddressSearchModal
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
        onSelect={selectAddress}
      />
    </AuthStepLayout>
  );
}
