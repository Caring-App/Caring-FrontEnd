import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { useSignupDraftStore, useSignupExit, useTermsAgreement, TERM_LIST } from '@features/auth/model';
import { AuthStepLayout, TermAgreeAllButton, TermRow } from '@features/auth/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'TermsAgreement'>;

// 약관 동의 (Figma 966:5613 미동의 / 966:5711 전체 동의) — 회원가입 단계의 첫 화면
export default function TermsAgreementScreen({ navigation, route }: Props) {
  const { role, social } = route.params;
  const handleClose = useSignupExit();

  // 약관 화면은 가입 단계의 시작점 — 여기로 돌아왔다는 건 X가 아니라 안드로이드 뒤로가기로 가입 단계를 빠져나온 것일
  // 수 있으므로, 앞 단계에서 입력한 값(비밀번호 포함)이 메모리에 남지 않게 비움. "다음"을 누르면 start()로 새로 시작함
  useFocusEffect(
    useCallback(() => {
      useSignupDraftStore.getState().reset();
    }, []),
  );
  const { checkedItems, isAllChecked, isRequiredChecked, handleCheckItem, handleCheckAll } = useTermsAgreement(TERM_LIST);

  const handleNextPress = () => {
    if (!isRequiredChecked) return;
    useSignupDraftStore.getState().start(role, social);

    // 소셜 신규 회원가입은 이름/전화번호를 카카오·네이버 프로필에서 받으므로 본인인증·비밀번호 단계를 건너뜀
    navigation.navigate(social ? 'SignupAddress' : 'SignupIdentity');
  };

  return (
    <AuthStepLayout
      title={'약관에 동의하고\n케어링을 시작하세요.'}
      description={'고객님의 정보 보호를 위해 최선을 다하고 있습니다.\n아래 내용을 확인 후 동의해주세요.'}
      onClose={handleClose}
      buttonLabel="동의하고 계속 진행"
      onPressButton={handleNextPress}
      buttonDisabled={!isRequiredChecked}
    >
      <View className="mt-6">
        <TermAgreeAllButton checked={isAllChecked} onPress={handleCheckAll} />
      </View>

      <View className="mt-5 gap-2 px-4">
        {TERM_LIST.map(term => (
          <TermRow
            key={term.id}
            title={term.title}
            required={term.required}
            checked={!!checkedItems[term.id]}
            onPress={() => handleCheckItem(term.id)}
          />
        ))}
      </View>
    </AuthStepLayout>
  );
}
