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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { useInquiryDetail } from '@features/inquiry/model';
import { InquiryStatusBadge } from '@features/inquiry/ui';
import { formatInquiryDateTime } from '@features/inquiry/utils';
import { colors } from '@shared/theme/colors';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';

type Props = NativeStackScreenProps<GuardianStackParamList, 'InquiryDetail'>;

// 문의 상세 — 문의 내용과 답변. 관리자 계정이면 아직 답변이 없을 때 여기서 답변을 등록할 수 있음
export function InquiryDetailScreen({ navigation, route }: Props) {
  const { inquiry, canAnswer, answerDraft, setAnswerDraft, isAnswering, submitAnswer } = useInquiryDetail(
    route.params.inquiryId,
  );
  const canSubmitAnswer = !!answerDraft.trim() && !isAnswering;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-pretendard-semibold text-text-primary">문의 상세</Text>
      </View>

      {!inquiry ? (
        <ActivityIndicator className="mt-10" size="small" color={colors.primary} />
      ) : (
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView className="flex-1 px-4" contentContainerClassName="py-4" keyboardShouldPersistTaps="handled">
            <View className="flex-row items-center gap-2">
              <InquiryStatusBadge answered={inquiry.answered} />
              <Text className="text-xs font-pretendard-medium text-text-muted">
                {formatInquiryDateTime(inquiry.createdAt)}
              </Text>
            </View>
            <Text className="mt-2 text-xl font-pretendard-bold text-text-primary">{inquiry.title}</Text>
            <Text className="mt-4 text-md font-pretendard-medium leading-6 text-text-body">{inquiry.content}</Text>

            <View className="mt-6 rounded-card bg-surface-subtle p-4">
              <Text className="text-md font-pretendard-bold text-text-primary">답변</Text>
              {inquiry.answered && inquiry.answer ? (
                <>
                  <Text className="mt-2 text-md font-pretendard-medium leading-6 text-text-body">{inquiry.answer}</Text>
                  {!!inquiry.answeredAt && (
                    <Text className="mt-2 text-xs font-pretendard-medium text-text-muted">
                      {formatInquiryDateTime(inquiry.answeredAt)}
                    </Text>
                  )}
                </>
              ) : (
                <Text className="mt-2 text-md font-pretendard-medium text-text-muted">
                  아직 답변이 등록되지 않았어요. 운영시간 내에 답변드릴게요.
                </Text>
              )}
            </View>

            {canAnswer && (
              <View className="mt-6 gap-2">
                <Text className="text-md font-pretendard-bold text-text-body">답변 작성 (관리자)</Text>
                <TextInput
                  className="min-h-[140px] rounded-[8px] border border-border-input px-3.5 py-3 font-pretendard text-md text-text-body"
                  placeholder="답변 내용을 입력해 주세요"
                  placeholderTextColor={colors.textPlaceholder}
                  value={answerDraft}
                  onChangeText={setAnswerDraft}
                  multiline
                  textAlignVertical="top"
                />
                <Pressable
                  className={`items-center justify-center rounded-card py-4 ${
                    canSubmitAnswer ? 'bg-primary' : 'bg-buttonMuted'
                  }`}
                  onPress={submitAnswer}
                  disabled={!canSubmitAnswer}>
                  {isAnswering ? (
                    <ActivityIndicator size="small" color={colors.surface} />
                  ) : (
                    <Text className="text-xl font-pretendard-semibold text-surface">답변 등록</Text>
                  )}
                </Pressable>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
