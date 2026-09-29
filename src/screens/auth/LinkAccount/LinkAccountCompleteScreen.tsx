import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { SignupWelcomeStep } from '@features/auth/ui/SignupWelcomeStep';
import { useSessionStore } from '@shared/store/useSessionStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'LinkAccountComplete'>;

export const LinkAccountCompleteScreen = ({ route }: Props) => {
  const protectorName = route.params?.protectorName || '---';

  return (
    <SignupWelcomeStep
      currentStep={{
        type: 'message',
        title: `입력해주신 보호자\n${protectorName}님과\n연동이 완료되었습니다!`,
        showClose: false,
        buttonLabel: '홈으로 이동',
      }}
      onNext={() => useSessionStore.getState().login('WARD')}
      onClose={() => {}}
    />
  );
};

export default LinkAccountCompleteScreen;
