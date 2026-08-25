import React, { useState } from 'react';
import { useSessionStore } from '@shared/store/useSessionStore';
import { useTourStore } from '@features/guardian-tour/model';
import { SignupWelcomeStep, WelcomeStep } from '@features/auth/ui/SignupWelcomeStep';

export const SignupWelcomeScreen = ({ route }: { route?: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 가입 시 넘겨받은 유저 이름 / 연동 코드 (없을 경우 기본값 지정)
  const userName = route?.params?.userName || '---';
  const protectorCode = route?.params?.protectorCode || '';

  // 피그마 시안(151:17151, 151:17215, 151:17248)과 동일한 3단계 스텝 데이터
  const steps: WelcomeStep[] = [
    {
      type: 'character',
      title: `안녕하세요 ${userName}님!\nCaring 가입이\n완료 되었습니다 !`,
      showClose: false,
    },
    {
      type: 'character',
      title: '서비스를 이용하기 전\nCaring의\n주요 기능 사용 방법을\n안내드릴게요!',
      showClose: true,
    },
    {
      type: 'code',
      title: 'Caring은\n개인의 고유 코드를 사용하여\n돌봄 대상자와의\n간편한 연동을 제공합니다',
      description: '돌봄 대상자 회원가입 후\n보호자의 연동 코드 입력란에\n입력해주세요!',
      showClose: true,
    },
  ];

  // X(닫기) → 안내 없이 바로 보호자 홈으로 진입
  const handleClose = () => {
    useSessionStore.getState().login('PROTECTOR');
  };

  // 마지막 단계에서 "다음" → 보호자 홈 진입과 동시에 사용가이드 자동 시작
  const handleFinish = () => {
    useTourStore.getState().requestAutoStart();
    useSessionStore.getState().login('PROTECTOR');
  };

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  return (
    <SignupWelcomeStep
      userName={userName}
      userCode={protectorCode}
      currentStep={steps[currentIndex]}
      onNext={handleNext}
      onClose={handleClose}
    />
  );
};
