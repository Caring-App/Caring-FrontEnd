import React from 'react';
import { SignupWelcomeStep } from '@features/auth/ui/SignupWelcomeStep';

export const WardSignupWelcomeScreen = ({ route, navigation }: { route?: any; navigation: any }) => {
  const userName = route?.params?.userName || '---';

  return (
    <SignupWelcomeStep
      userName={userName}
      currentStep={{
        type: 'character',
        title: `안녕하세요 ${userName}님!\nCaring 가입이\n완료 되었습니다 !`,
        showClose: false,
      }}
      onNext={() => navigation.navigate('LinkAccount')}
      onClose={() => {}}
    />
  );
};

export default WardSignupWelcomeScreen;
