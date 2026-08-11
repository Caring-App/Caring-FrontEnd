import React from 'react';
import { SignupWelcomeStep } from '@features/auth/ui/SignupWelcomeStep';
import { useSessionStore } from '@shared/store/useSessionStore';

export const LinkAccountCompleteScreen = ({ route }: { route?: any }) => {
  const protectorName = route?.params?.protectorName || '---';

  return (
    <SignupWelcomeStep
      currentStep={{
        type: 'character',
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
