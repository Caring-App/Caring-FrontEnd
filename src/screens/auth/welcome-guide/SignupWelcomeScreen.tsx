import React, { useState } from 'react';
import { useSessionStore } from '@shared/store/useSessionStore';
import { SignupWelcomeStep, WelcomeStep } from '@features/auth/ui/SignupWelcomeStep';

export const SignupWelcomeScreen = ({ route }: { route?: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 가입 시 넘겨받은 유저 이름 (없을 경우 기본값 지정)
  const userName = route?.params?.userName || '---';

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

  const handleComplete = () => {
    // 온보딩 종료 → 보호자 홈으로 진입 (세션 전환 시 RootNavigator가 GuardianStackNavigator로 자동 전환)
    // TODO: 사용가이드(안내 다음 단계)는 별도 작업 중 — 완료 시 해당 화면으로 이동하도록 교체 필요
    useSessionStore.getState().login('PROTECTOR');
  };

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <SignupWelcomeStep
      userName={userName}
      currentStep={steps[currentIndex]}
      onNext={handleNext}
      onClose={handleComplete}
    />
  );
};
