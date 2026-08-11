import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SignupWelcomeStep } from './components/SignupWelcomeStep';

export const SignupWelcomeScreen = ({ route, navigation }: { route?: any; navigation: any }) => {
  // 💡 [팁] 개발 및 테스트 중 바로 연동 코드 화면을 보려면 초기값을 2로 설정해보세요!
  // 테스트 후에는 다시 0으로 돌려놓으시면 됩니다.
  const [currentIndex, setCurrentIndex] = useState(0); 

  // 가입 시 넘겨받은 유저 이름 (없을 경우 기본값 지정)
  const userName = route?.params?.userName || '---';

  // 피그마 시안과 동일한 3단계 스텝 데이터
  const steps = [
    {
      type: 'character',
      title: `안녕하세요 ${userName}님!\nCaring 가입이\n완료 되었습니다 !`,
    },
    {
      type: 'character',
      title: '서비스를 이용하기 전\nCaring의\n주요 기능 사용 방법을\n안내해드릴게요!',
    },
    {
      type: 'code',
      title: 'Caring은\n개인의 고유 코드를 사용하여\n돌봄 대상과의\n간편한 연동을 제공합니다',
      description: '돌봄 대상자 회원가입 후\n보호자의 연동 코드 입력란에\n입력해주세요!',
    },
  ];

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // 마지막 단계에서 [다음] 클릭 시 메인/다음 스크린으로 이동
      navigation.goBack(); 
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SignupWelcomeStep
        navigation={navigation}
        userName={userName}
        currentStep={steps[currentIndex]}
        onNext={handleNext}
        onClose={handleClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});