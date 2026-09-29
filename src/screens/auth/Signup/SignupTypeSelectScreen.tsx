import React from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackNavigationProp, AuthStackParamList } from '@app/navigation/types';

import { useSignupTypeSelect } from '@features/auth/model';
import { CaringLogoHorizontal } from '@shared/ui/AppHeader/CaringLogo';
import { colors } from '@shared/theme/colors';

const ROLE_OPTIONS = [
  { role: 'PROTECTOR', label: '보호자' },
  { role: 'WARD', label: '돌봄대상자' },
] as const;

// 역할 선택 (Figma 965:5380)
export const SignupTypeSelectScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'SignupTypeSelect'>>();
  const social = route.params?.social;
  const { handleRoleSelect, isCheckingSocial, socialError } = useSignupTypeSelect(navigation, social);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <View className="px-5 pt-3">
        <CaringLogoHorizontal />
      </View>

      <View className="flex-1 justify-center px-[43px] pb-16">
        <Text className="font-pretendard-bold text-[24px] leading-[36px] text-black">어떤 서비스를 이용하시나요?</Text>

        <View className="mt-10 gap-[26px]">
          {ROLE_OPTIONS.map(({ role, label }) => (
            <TouchableOpacity
              key={role}
              className="h-[58px] items-center justify-center rounded-lg bg-primary"
              onPress={() => handleRoleSelect(role)}
              disabled={isCheckingSocial}
              activeOpacity={0.8}
            >
              <Text className="font-pretendard-bold text-xl text-white">{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isCheckingSocial && <ActivityIndicator className="mt-6" size="small" color={colors.primary} />}
        {!!socialError && <Text className="mt-6 text-center text-xs text-text-danger">{socialError}</Text>}
      </View>
    </SafeAreaView>
  );
};

export default SignupTypeSelectScreen;
