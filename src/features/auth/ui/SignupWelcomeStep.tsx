import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';
import { CaringDogImage } from './CaringDogImage';
import { RssIcon } from './RssIcon';
import CloseIcon from '@assets/icons/action/close-x.svg';

export interface WelcomeStep {
  type: 'character' | 'code';
  title: string;
  description?: string;
  showClose?: boolean;
}

interface Props {
  userName?: string;
  currentStep: WelcomeStep;
  onNext: () => void;
  onClose: () => void;
}

export const SignupWelcomeStep = ({ userName = '---', currentStep, onNext, onClose }: Props) => {
  const userCode = 'ABC123-DFG456';

  const handleCopyCode = () => {
    Clipboard.setString(userCode);
    Alert.alert('복사 완료', '연동 코드가 복사되었습니다.');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* 상단 헤더 */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <CaringLogo size={44} />
        {currentStep.showClose && (
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <CloseIcon width={16} height={16} />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 items-center px-6">
        {currentStep.type === 'character' && (
          <>
            <CaringDogImage size={400} />
            <Text className="-mt-10 text-center font-pretendard-bold text-[32px] text-text-strong">
              {currentStep.title}
            </Text>
          </>
        )}

        {currentStep.type === 'code' && (
          <View className="w-full flex-1 justify-center">
            <Text className="text-center font-pretendard-bold text-2xl text-text-strong">{currentStep.title}</Text>

            {/* 연동 코드 카드 */}
            <View className="mt-8 rounded-card border border-border bg-surface p-4">
              <View className="mb-2 flex-row items-center gap-2">
                <RssIcon width={20} height={20} color="#FD7E14" />
                <Text className="font-pretendard-bold text-xl text-text-primary">{userName}님 고유 연동 코드</Text>
              </View>
              <Text className="mb-4 font-pretendard-medium text-xs text-text-muted">
                돌봄대상자와의 안전한 연결을 위해 아래 코드를 복사하여 전달해 주세요.
              </Text>

              {/* 연동 코드 입력란 (안쪽 테두리 박스) */}
              <View className="rounded-card border border-border p-4">
                <View className="relative flex-row items-center justify-center">
                  <Text className="font-pretendard-semibold text-lg text-text-body">연동 코드</Text>
                  <TouchableOpacity
                    className="absolute right-0 rounded-lg bg-primary px-3 py-1.5"
                    onPress={handleCopyCode}
                    activeOpacity={0.8}
                  >
                    <Text className="font-pretendard-semibold text-sm text-white">복사</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  className="mt-2 h-[44px] rounded-md border border-border-input px-4 text-center font-pretendard-semibold text-lg text-text-body"
                  style={{ letterSpacing: 1 }}
                  value={userCode}
                  editable={false}
                />
              </View>
            </View>

            {!!currentStep.description && (
              <Text className="mt-10 text-center font-pretendard-bold text-lg text-text-primary">
                {currentStep.description}
              </Text>
            )}
          </View>
        )}
      </View>

      <View className="items-center pb-10 pt-2">
        <TouchableOpacity
          className="h-[51px] w-[200px] items-center justify-center rounded-[10px] bg-primary"
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text className="font-pretendard-medium text-base text-white">다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
