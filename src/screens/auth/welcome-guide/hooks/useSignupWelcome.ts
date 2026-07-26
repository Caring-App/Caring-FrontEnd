import { useState } from 'react';

const WELCOME_STEPS = [
  {
    id: 1,
    type: 'character',
    title: '안녕하세요 ---님!\nCaring 가입이 완료 되었습니다 !',
  },
  {
    id: 2,
    type: 'character',
    title: '서비스를 이용하기 전 Caring의\n주요 기능 사용 방법을 안내해드릴게요!',
  },
  {
    id: 3,
    type: 'code',
    title: 'Caring은 개인의 고유 코드를 사용하여 돌봄 대상자와의 간편한 연동을 제공합니다',
    description: '돌봄 대상자 회원가입 후 보호자의 연동 코드 입력란에 입력해주세요!',
  },
  {
    id: 4,
    type: 'highlight',
    title: '실시간 건강 모니터링',
    description: '돌봄 대상자의 건강 상태와 움직임을 실시간으로 확인할 수 있습니다.',
  },
];

export const useSignupWelcome = (navigation: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSteps = WELCOME_STEPS.length;
  const currentStep = WELCOME_STEPS[currentIndex];

  const handleNextPress = () => {
    if (currentIndex < totalSteps - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.replace('Home');
      }
    }
  };

  const handleClosePress = () => {
    navigation.goBack();
  };

  return {
    currentStep,
    currentIndex,
    totalSteps,
    handleNextPress,
    handleClosePress,
  };
};