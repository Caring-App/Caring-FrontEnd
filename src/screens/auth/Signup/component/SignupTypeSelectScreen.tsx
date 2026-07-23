import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { signupTypeSelectStyles } from '../styles/signupTypeSelect.styles';
import { useSignupTypeSelect } from '../hooks/useSignupTypeSelect';
import RoleSelectButton from './RoleSelectButton';

export default function SignupTypeSelectScreen({ navigation }: { navigation: any }) {
  const { handleRoleSelect } = useSignupTypeSelect(navigation);

  return (
    <SafeAreaView style={signupTypeSelectStyles.safeArea}>
      <View style={signupTypeSelectStyles.container}>
        
        {/* 안내 문구 영역 */}
        <View style={signupTypeSelectStyles.textContainer}>
          <Text style={signupTypeSelectStyles.title}>안녕하세요!</Text>
          <Text style={signupTypeSelectStyles.title}>어떤 서비스를 이용하시나요?</Text>
        </View>

        {/* 선택 버튼 영역 */}
        <View style={signupTypeSelectStyles.buttonContainer}>
          <RoleSelectButton 
            title="보호자" 
            onPress={() => handleRoleSelect('PROTECTOR')} 
          />
          <RoleSelectButton 
            title="돌봄대상자" 
            onPress={() => handleRoleSelect('WARD')} 
          />
        </View>

      </View>
    </SafeAreaView>
  );
}