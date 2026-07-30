import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { signupTypeSelectStyles } from '../styles/signupTypeSelect.styles';
import { useSignupTypeSelect } from '../hooks/useSignupTypeSelect';

import { CaringLogo } from './CaringLogo';
import { CaringDogIcon } from './CaringDogIcon';

export const SignupTypeSelectScreen = () => {
  const navigation = useNavigation();
  const typeSelectHook = useSignupTypeSelect(navigation) as any;

  const handleSelectType = 
    typeSelectHook?.handleRoleSelect || 
    typeSelectHook?.handleSelectType || 
    typeSelectHook?.onSelectType;

  return (
    <SafeAreaView style={signupTypeSelectStyles.container}>
      {/* 1. 상단 케어링 로고 */}
      <View style={[signupTypeSelectStyles.logoWrapper, { marginTop: 50 }]}>
      <CaringLogo width={50} height={50} />
      </View>
      

      {/* 2. 중앙 컨텐츠 영역 (강아지 + 텍스트 + 버튼) */}
      <View style={signupTypeSelectStyles.contentContainer}>
        {/* 강아지 캐릭터 */}
        <View style={signupTypeSelectStyles.characterContainer}>
          <CaringDogIcon width={600} height={600} />
        </View>

        {/* 메인 안내 문구 (강아지 발 바로 아래) */}
        <Text style={signupTypeSelectStyles.title}>안녕하세요!</Text>
        <Text style={signupTypeSelectStyles.subtitle}>
          어떤 서비스를 이용하시나요?
        </Text>

        {/* 3. 역할 선택 버튼 영역 */}
        <View style={signupTypeSelectStyles.buttonRow}>
          <TouchableOpacity
            style={signupTypeSelectStyles.typeButton}
            onPress={() => handleSelectType && handleSelectType('GUARDIAN')}
            activeOpacity={0.7}
          >
            <Text style={signupTypeSelectStyles.buttonText}>보호자</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={signupTypeSelectStyles.typeButton}
            onPress={() => handleSelectType && handleSelectType('SENIOR')}
            activeOpacity={0.7}
          >
            <Text style={signupTypeSelectStyles.buttonText}>돌봄대상자</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupTypeSelectScreen;