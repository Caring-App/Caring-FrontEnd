import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@app/navigation/types';
import { SignupWelcomeStep } from '@features/auth/ui/SignupWelcomeStep';

type Props = NativeStackScreenProps<AuthStackParamList, 'WardSignupWelcome'>;

export const WardSignupWelcomeScreen = ({ route, navigation }: Props) => {
  const userName = route.params?.userName || '---';

  return (
    <SignupWelcomeStep
      userName={userName}
      currentStep={{
        type: 'message',
        title: `안녕하세요 ${userName}님!\nCaring 가입이\n완료 되었습니다 !`,
        showClose: false,
      }}
      onNext={() => navigation.navigate('LinkAccount')}
      onClose={() => {}}
    />
  );
};

export default WardSignupWelcomeScreen;
