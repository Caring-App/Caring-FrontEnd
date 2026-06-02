import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/useAuthStore';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

// 추후 화면 만들면 아래 임시 컴포넌트를 지우고 진짜 Screen을 import 해서 교체예정
const TempAuthScreen = () => <View><Text>로그인/회원가입 화면</Text></View>;
const TempProtectorScreen = () => <View><Text>보호자 메인 화면</Text></View>;
const TempWardScreen = () => <View><Text>돌봄대상자 메인 화면</Text></View>;

export const RootNavigator = () => {
  const { isLoggedIn, userRole } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          // 1. 로그인 안 된 상태면 무조건 Auth 화면
          <Stack.Screen name="Auth" component={TempAuthScreen} />
        ) : userRole === 'PROTECTOR' ? (
          // 2. 보호자로 로그인한 상태
          <Stack.Screen name="ProtectorHome" component={TempProtectorScreen} />
        ) : (
          // 3. 돌봄 대상자로 로그인한 상태
          <Stack.Screen name="WardHome" component={TempWardScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};