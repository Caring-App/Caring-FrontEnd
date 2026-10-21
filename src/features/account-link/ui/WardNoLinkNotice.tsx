import React from 'react';
import { View } from 'react-native';
import { showNotice } from '@shared/model';
import { WardText } from '@shared/ui';
// FSD 원칙상 feature끼리 참조하지 않는 게 이상적이지만, 연동 코드 입력란·버튼은 회원가입 연동 화면(LinkAccountScreen)과
// 같은 UI라 auth의 것을 그대로 가져다 씀(순환참조 없음)
import { AuthPrimaryButton, CodeInputField } from '@features/auth/ui';
import { useLinkAccount } from '../model';

// 보호자와 연동되지 않은 어르신 계정에 메인 화면 대신 보여주는 안내 + 연동 코드 입력.
// 보호자 화면의 NoLinkedWardNotice와 짝 — 어르신은 마이페이지가 없어서 이 자리에서 바로 코드를 입력받음
export function WardNoLinkNotice({ onLinked }: { onLinked: () => void }) {
  const { code, setCode, handlePaste, handleSubmit, isValidCode, isSubmitting, submitError } = useLinkAccount();

  const handleLink = async () => {
    if (!isValidCode || isSubmitting) return;
    const result = await handleSubmit();
    if (result) {
      showNotice('연동이 완료되었어요', `보호자 ${result.protectorName}님과 연동되었어요.`);
      onLinked();
    }
  };

  return (
    <View className="gap-4 rounded-card border border-border p-5">
      <View className="items-center gap-2">
        <WardText size="xl" className="font-pretendard-bold text-text-primary">
          연동된 보호자가 없어요
        </WardText>
        <WardText size="md" className="text-center font-pretendard-medium text-text-muted">
          보호자의 연동 코드를 입력하면{'\n'}건강·복약·일정 기능을 쓸 수 있어요.
        </WardText>
        <WardText size="sm" className="text-center font-pretendard-medium text-text-muted">
          보호자 마이페이지 {'>'} 연동 코드 확인 {'>'} 코드 복사
        </WardText>
      </View>

      <CodeInputField
        value={code}
        onChangeText={setCode}
        buttonLabel="붙여넣기"
        onButtonPress={handlePaste}
        placeholder="연동 코드를 입력하세요"
        autoCapitalize="characters"
      />

      {!!submitError && (
        <WardText size="sm" className="text-center text-text-danger">
          {submitError}
        </WardText>
      )}

      <AuthPrimaryButton label="연동하기" onPress={handleLink} disabled={!isValidCode} isLoading={isSubmitting} />
    </View>
  );
}
