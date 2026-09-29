import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { INQUIRY_CONTENT_MAX_LENGTH, INQUIRY_TITLE_MAX_LENGTH, useInquiryWriteForm } from '@features/inquiry/model';
import { colors } from '@shared/theme/colors';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';

const INPUT_CLASSNAME = 'rounded-[8px] border border-border-input px-3.5 py-3 font-pretendard text-md text-text-body';

// 문의 작성 — 제목과 내용을 입력해 등록하면 문의 목록으로 돌아감
export function InquiryWriteScreen() {
  const navigation = useNavigation();
  const { title, setTitle, content, setContent, canSubmit, isSubmitting, submit } = useInquiryWriteForm(() =>
    navigation.goBack(),
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-pretendard-semibold text-text-primary">문의 작성</Text>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView className="flex-1 px-4" contentContainerClassName="gap-5 py-4" keyboardShouldPersistTaps="handled">
          <View className="gap-2">
            <Text className="text-md font-pretendard-bold text-text-body">제목</Text>
            <TextInput
              className={INPUT_CLASSNAME}
              placeholder="문의 제목을 입력해 주세요"
              placeholderTextColor={colors.textPlaceholder}
              value={title}
              onChangeText={setTitle}
              maxLength={INQUIRY_TITLE_MAX_LENGTH}
            />
          </View>

          <View className="gap-2">
            <Text className="text-md font-pretendard-bold text-text-body">내용</Text>
            <TextInput
              className={`${INPUT_CLASSNAME} min-h-[200px]`}
              placeholder="궁금하신 점이나 불편 사항을 자세히 적어 주세요"
              placeholderTextColor={colors.textPlaceholder}
              value={content}
              onChangeText={setContent}
              maxLength={INQUIRY_CONTENT_MAX_LENGTH}
              multiline
              textAlignVertical="top"
            />
            <Text className="self-end text-xs font-pretendard-medium text-text-muted">
              {content.length} / {INQUIRY_CONTENT_MAX_LENGTH}
            </Text>
          </View>
        </ScrollView>

        <View className="px-4 pb-4 pt-2">
          <Pressable
            className={`items-center justify-center rounded-card py-4 ${canSubmit ? 'bg-primary' : 'bg-buttonMuted'}`}
            onPress={submit}
            disabled={!canSubmit}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.surface} />
            ) : (
              <Text className="text-2xl font-pretendard-semibold text-surface">문의 등록</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
