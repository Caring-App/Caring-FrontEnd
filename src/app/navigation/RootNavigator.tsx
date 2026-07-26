import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 화면 컴포넌트들 import
import LoginScreen from '../../screens/auth/Login/LoginScreen';
import { SignupWelcomeScreen } from '../../screens/auth/welcome-guide/SignupWelcomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* initialRouteName을 작성하신 화면의 등록 이름으로 임시 변경합니다 */}
      <Stack.Navigator initialRouteName="SignupWelcome" screenOptions={{ headerShown: false }}>
        
        {/* 테스트할 웰컴 가이드 화면 */}
        <Stack.Screen name="SignupWelcome" component={SignupWelcomeScreen} />
        
        {/* 기존 로그인 화면 */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}