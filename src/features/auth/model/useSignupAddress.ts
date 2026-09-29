import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { AddressSearchResult } from '@shared/ui';
import { useSignupDraftStore } from './useSignupDraftStore';
import { useSignupSubmit } from './useSignupSubmit';

// 회원가입 주소 단계 (Figma 970:7630) — 기본 주소는 다음(카카오) 우편번호 검색으로만 고르고 상세 주소만 직접 입력.
// 백엔드가 기본 주소를 지오코딩해 좌표로 저장하므로 자유 입력은 받지 않음(AddressInput 참고)
export function useSignupAddress() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const role = useSignupDraftStore(state => state.role);
  const [baseAddress, setBaseAddress] = useState(() => useSignupDraftStore.getState().baseAddress);
  const [detailAddress, setDetailAddress] = useState(() => useSignupDraftStore.getState().detailAddress);
  const { submit, isSubmitting, submitError } = useSignupSubmit(navigation);

  // 보호자는 주소가 마지막 단계라 여기서 가입 요청, 돌봄대상자는 기저질환 단계가 하나 더 있음
  const isLastStep = role !== 'WARD';

  // 다른 기본 주소를 고르면 이전 주소 기준으로 입력한 상세 주소(동·호수)는 맞지 않으므로 비움
  const selectAddress = (result: AddressSearchResult) => {
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

  return {
    baseAddress,
    detailAddress,
    setDetailAddress,
    selectAddress,
    handleNext,
    isSubmitting,
    submitError,
  };
}
