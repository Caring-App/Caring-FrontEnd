import React, { useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { useSignupDraftStore, useSignupExit, useSignupSubmit } from '@features/auth/model';
import { AuthFieldLabel, AuthStepLayout, AuthTextField } from '@features/auth/ui';
import { AddressSearchModal, AddressSearchResult } from '@shared/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignupAddress'>;

// 주소 입력 (Figma 970:7630) — 기본 주소는 일정 관리 장소 추가와 같은 다음(카카오) 우편번호 검색으로만 고르고,
// 상세 주소만 직접 입력. 백엔드가 기본 주소를 지오코딩해 좌표로 저장하므로 자유 입력은 받지 않음(AddressInput 참고)
export default function SignupAddressScreen({ navigation }: Props) {
  const role = useSignupDraftStore(state => state.role);
  const [baseAddress, setBaseAddress] = useState(() => useSignupDraftStore.getState().baseAddress);
  const [detailAddress, setDetailAddress] = useState(() => useSignupDraftStore.getState().detailAddress);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { submit, isSubmitting, submitError } = useSignupSubmit(navigation);

  // 보호자는 주소가 마지막 단계라 여기서 가입 요청, 돌봄대상자는 기저질환 단계가 하나 더 있음
  const isLastStep = role !== 'WARD';

  // 다른 기본 주소를 고르면 이전 주소 기준으로 입력한 상세 주소(동·호수)는 맞지 않으므로 비움
  const handleSelectAddress = (result: AddressSearchResult) => {
    if (result.address !== baseAddress) setDetailAddress('');
    setBaseAddress(result.address);
  };

  const handleNext = () => {
    if (!baseAddress) return;
    useSignupDraftStore.getState().setAddress(baseAddress, detailAddress.trim());
    if (isLastStep) {
      submit();
    } else {
      navigation.navigate('SignupDisease');
    }
  };

  const handleClose = useSignupExit();

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
        onSelect={handleSelectAddress}
      />
    </AuthStepLayout>
  );
}
