import React from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useSocialAdditionalInfo from '@features/auth/model/useSocialAdditionalInfo';
import { DiseaseSelector } from '@features/auth/ui';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';
import { FormField } from '@shared/ui';
import { colors } from '@shared/theme/colors';

const FORM_INPUT_CLASSNAME =
  'rounded-md border border-border-input bg-surface px-3.5 py-2 font-pretendard-light text-lg text-text-body';

// 소셜 간편 회원가입 마지막 단계 — 카카오/네이버 프로필로 채워지지 않는 정보만 직접 입력받음
// (보호자: 주소, 돌봄대상자: 주소 + 기저질환)
export default function SocialAdditionalInfoScreen({ navigation, route }: any) {
  const { role, address, setAddress, selectedDiseases, toggleDisease, isFormValid, isSubmitting, submitError, handleSubmit } =
    useSocialAdditionalInfo(navigation, route.params);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {/* 상단 헤더 */}
        <View className="relative flex-row items-center justify-center py-4">
          <View className="absolute left-0">
            <CaringLogo size={44} />
          </View>
          <Text className="font-pretendard-bold text-2xl text-text-primary">추가 정보 입력</Text>
        </View>

        <Text className="mt-2 text-center font-pretendard-medium text-sm text-text-muted">
          서비스 이용을 위해 몇 가지만 더 알려주세요
        </Text>

        <View className="mt-6">
          <FormField label="주소">
            <TextInput
              className={FORM_INPUT_CLASSNAME}
              placeholder="주소를 입력해 주세요"
              placeholderTextColor={colors.textPlaceholder}
              value={address}
              onChangeText={setAddress}
            />
          </FormField>

          {role === 'WARD' && <DiseaseSelector selectedDiseases={selectedDiseases} onToggle={toggleDisease} />}
        </View>

        {!!submitError && <Text className="mt-2 text-center text-xs text-text-danger">{submitError}</Text>}

        <TouchableOpacity
          className={`mt-6 h-[52px] items-center justify-center rounded-card ${
            isFormValid && !isSubmitting ? 'bg-primary' : 'bg-border-link'
          }`}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text className="font-pretendard-semibold text-lg text-white">회원가입</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
