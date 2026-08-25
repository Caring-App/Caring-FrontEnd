import React from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLinkAccount } from '@features/account-link/model';
import { CodeInputField } from '@features/auth/ui';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';
import { colors } from '@shared/theme/colors';
import RssIcon from '@assets/icons/action/rss.svg';

export default function LinkAccountScreen({ navigation }: { navigation: any }) {
  const { code, setCode, handlePaste, handleSubmit, isValidCode, isSubmitting, submitError } = useLinkAccount();

  const handleNext = async () => {
    if (!isValidCode || isSubmitting) return;
    const result = await handleSubmit();
    if (result) {
      navigation.navigate('LinkAccountComplete', { protectorName: result.protectorName });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* 상단 헤더 */}
      <View className="px-6 py-4">
        <CaringLogo size={44} />
      </View>

      <View className="flex-1 justify-center px-6">
        <Text className="text-center font-pretendard-bold text-2xl text-text-strong">
          Caring은{'\n'}개인의 고유 코드를 사용하여{'\n'}보호자와의{'\n'}간편한 연동을 제공합니다
        </Text>

        {/* 연동 코드 입력 카드 */}
        <View className="mt-8 rounded-card border border-border bg-surface p-4">
          <View className="mb-2 flex-row items-center gap-2">
            <RssIcon width={20} height={20} color={colors.primary} />
            <Text className="font-pretendard-bold text-xl text-text-primary">연동 코드 입력</Text>
          </View>
          <Text className="mb-4 font-pretendard-medium text-xs text-text-muted">
            보호자 마이페이지 {'>'} 연동 코드 확인 {'>'} 코드 복사
          </Text>

          {/* 연동 코드 입력란 (안쪽 테두리 박스) */}
          <CodeInputField
            value={code}
            onChangeText={setCode}
            buttonLabel="붙여넣기"
            onButtonPress={handlePaste}
            placeholder="연동 코드를 입력하세요"
            autoCapitalize="characters"
          />
        </View>

        <Text className="mt-10 text-center font-pretendard-bold text-lg text-text-primary">
          연동을 진행할{'\n'}보호자의 연동 코드를{'\n'}입력해주세요!
        </Text>

        {!!submitError && (
          <Text className="mt-4 text-center text-xs text-text-danger">{submitError}</Text>
        )}
      </View>

      <View className="items-center px-6 pb-10 pt-2">
        <TouchableOpacity
          className={`h-[52px] w-full items-center justify-center rounded-card ${
            isValidCode && !isSubmitting ? 'bg-primary' : 'bg-border-link'
          }`}
          onPress={handleNext}
          disabled={!isValidCode || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Text className="font-pretendard-semibold text-lg text-white">다음</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
