import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';
import { CaringLogoHorizontal } from '@shared/ui/AppHeader/CaringLogo';
import { colors } from '@shared/theme/colors';
import { CodeInputField } from './CodeInputField';
import { AuthPrimaryButton } from './AuthPrimaryButton';
import RssIcon from '@assets/icons/action/rss.svg';
import CloseIcon from '@assets/icons/action/close-x.svg';
import { showNotice } from '@shared/model';

export interface WelcomeStep {
  type: 'message' | 'code';
  title: string;
  description?: string;
  showClose?: boolean;
  buttonLabel?: string;
}

interface Props {
  userName?: string;
  userCode?: string;
  currentStep: WelcomeStep;
  onNext: () => void;
  onClose: () => void;
}

// 가입 완료 / 연동 코드 안내 / 연동 완료 화면 공용 (Figma 970:8074, 970:8273)
// 좌상단 가로형 로고 + 큰 안내 문구 + 하단 주황 버튼
export const SignupWelcomeStep = ({ userName = '---', userCode = '', currentStep, onNext, onClose }: Props) => {
  const handleCopyCode = () => {
    Clipboard.setString(userCode);
    showNotice('복사 완료', '연동 코드가 복사되었습니다.');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      {/* 상단 헤더 */}
      <View className="flex-row items-center justify-between px-5 pt-3">
        <CaringLogoHorizontal />
        {currentStep.showClose && (
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <CloseIcon width={16} height={16} />
          </TouchableOpacity>
        )}
      </View>

      {currentStep.type === 'message' && (
        // 시안에서 문구 블록이 화면 중앙보다 위(약 1/3 지점)에 있어서 위:아래 여백을 1:2로 나눔
        <View className="flex-1 px-8">
          <View className="flex-1" />
          <Text className="font-pretendard-bold text-[32px] leading-[44.8px] text-text-strong">{currentStep.title}</Text>
          <View className="flex-[2]" />
        </View>
      )}

      {currentStep.type === 'code' && (
        <View className="flex-1 justify-center px-6">
          <Text className="text-center font-pretendard-bold text-2xl text-text-strong">{currentStep.title}</Text>

          {/* 연동 코드 카드 */}
          <View className="mt-8 rounded-card border border-border bg-surface p-4">
            <View className="mb-2 flex-row items-center gap-2">
              <RssIcon width={20} height={20} color={colors.primary} />
              <Text className="font-pretendard-bold text-xl text-text-primary">{userName}님 고유 연동 코드</Text>
            </View>
            <Text className="mb-4 font-pretendard-medium text-xs text-text-muted">
              돌봄대상자와의 안전한 연결을 위해 아래 코드를 복사하여 전달해 주세요.
            </Text>

            {/* 연동 코드 입력란 (안쪽 테두리 박스) */}
            <CodeInputField value={userCode} editable={false} buttonLabel="복사" onButtonPress={handleCopyCode} />
          </View>

          {!!currentStep.description && (
            <Text className="mt-10 text-center font-pretendard-bold text-lg text-text-primary">
              {currentStep.description}
            </Text>
          )}
        </View>
      )}

      <View className="px-6 pb-6 pt-2">
        <AuthPrimaryButton label={currentStep.buttonLabel || '다음'} onPress={onNext} />
      </View>
    </SafeAreaView>
  );
};
