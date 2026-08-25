import React from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useSignupTypeSelect } from '@features/auth/model';
import { CaringDogImage } from '@features/auth/ui';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';
import { colors } from '@shared/theme/colors';

export const SignupTypeSelectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const social = route.params?.social;
  const { handleRoleSelect, isCheckingSocial, socialError } = useSignupTypeSelect(navigation, social);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* 상단 케어링 로고 */}
      <View className="px-6 py-4">
        <CaringLogo size={44} />
      </View>

      {/* 중앙 컨텐츠 영역 */}
      <View className="flex-1 items-center px-6">
        <CaringDogImage size={400} />

        <Text className="-mt-10 text-center font-pretendard-bold text-[32px] text-text-strong">안녕하세요!</Text>
        <Text className="text-center font-pretendard-bold text-[32px] text-text-strong">어떤 서비스를 이용하시나요?</Text>

        {/* 역할 선택 버튼 */}
        <View className="mt-10 w-full flex-row gap-4">
          <TouchableOpacity
            className="h-[74px] flex-1 items-center justify-center rounded-card border-2 border-primary bg-surface"
            onPress={() => handleRoleSelect('PROTECTOR')}
            disabled={isCheckingSocial}
            activeOpacity={0.7}
          >
            <Text className="font-pretendard-medium text-[28px] text-text-primary">보호자</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="h-[74px] flex-1 items-center justify-center rounded-card border-2 border-primary bg-surface"
            onPress={() => handleRoleSelect('WARD')}
            disabled={isCheckingSocial}
            activeOpacity={0.7}
          >
            <Text className="font-pretendard-medium text-[28px] text-text-primary">돌봄대상자</Text>
          </TouchableOpacity>
        </View>

        {isCheckingSocial && <ActivityIndicator className="mt-6" size="small" color={colors.primary} />}
        {!!socialError && <Text className="mt-6 text-center text-xs text-text-danger">{socialError}</Text>}
      </View>
    </SafeAreaView>
  );
};

export default SignupTypeSelectScreen;
