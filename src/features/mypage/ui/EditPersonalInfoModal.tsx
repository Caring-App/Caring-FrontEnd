import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import CloseXIcon from '@assets/icons/action/close-x.svg';
import {
  FORMATTED_PHONE_MAX_LENGTH,
  formatPhoneNumber,
  isValidPhoneNumber,
  VERIFICATION_CODE_LENGTH,
} from '@features/auth/utils';
import { AddressInput, FormField as SharedFormField } from '@shared/ui';
import { colors } from '@shared/theme/colors';
import { useChangePhone, useEditPersonalInfo } from '../model';
import { FormField } from './FormField';

const INPUT_CLASSNAME = 'rounded-[6px] border border-border-input px-3 py-2 text-lg text-text-body';

// 개인 정보 수정 — 전화번호(SMS 인증 후 "전화번호 변경"으로 바로 저장, 모달은 닫지 않음)와 주소·비밀번호(저장하기)는 서버 API가 달라서 따로 저장함.
// 열 때마다 입력값이 비어 있어야 해서 호출부에서 key를 바꿔 새로 마운트함
export function EditPersonalInfoModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const phone = useChangePhone();
  const info = useEditPersonalInfo(onClose);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-4" onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="max-h-[90%] w-full max-w-[375px]">
          <Pressable className="max-h-full rounded-card bg-surface p-4" onPress={() => {}}>
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-pretendard-bold text-text-primary">개인 정보 수정</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <CloseXIcon width={20} height={20} />
              </Pressable>
            </View>

            <ScrollView className="mt-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View className="gap-3 rounded-card border border-border p-4">
                <Text className="text-md font-pretendard-bold text-text-heading">전화번호</Text>
                <View className="flex-row gap-2">
                  <TextInput
                    className={`flex-1 ${INPUT_CLASSNAME}`}
                    placeholder="새 전화번호"
                    placeholderTextColor={colors.textPlaceholder}
                    keyboardType="number-pad"
                    value={formatPhoneNumber(phone.phone)}
                    onChangeText={phone.setPhone}
                    maxLength={FORMATTED_PHONE_MAX_LENGTH}
                  />
                  <SmallButton
                    label={phone.isCodeSent ? '재발송' : '인증번호 받기'}
                    onPress={phone.handleSendAuthCode}
                    disabled={!isValidPhoneNumber(phone.phone) || phone.isSendingCode || phone.isPhoneVerified}
                    isLoading={phone.isSendingCode}
                  />
                </View>
                {phone.isCodeSent && (
                  <View className="flex-row gap-2">
                    <View className="flex-1 flex-row items-center rounded-[6px] border border-border-input px-3">
                      <TextInput
                        className="flex-1 py-2 text-lg text-text-body"
                        placeholder="인증번호 6자리"
                        placeholderTextColor={colors.textPlaceholder}
                        keyboardType="number-pad"
                        value={phone.authCode}
                        onChangeText={phone.setAuthCode}
                        maxLength={VERIFICATION_CODE_LENGTH}
                        editable={!phone.isPhoneVerified}
                      />
                      {!phone.isPhoneVerified && (
                        <Text className="text-sm font-pretendard-medium text-primary">{phone.remainingTime}</Text>
                      )}
                    </View>
                    <SmallButton
                      label={phone.isPhoneVerified ? '인증완료' : '확인'}
                      onPress={phone.handleVerifyAuthCode}
                      disabled={
                        phone.authCode.length !== VERIFICATION_CODE_LENGTH ||
                        phone.isCodeExpired ||
                        phone.isVerifyingCode ||
                        phone.isPhoneVerified
                      }
                      isLoading={phone.isVerifyingCode}
                    />
                  </View>
                )}
                {!!phone.errorMessage && <Text className="text-xs text-text-danger">{phone.errorMessage}</Text>}
                {!!phone.successMessage && (
                  <Text className="text-xs font-pretendard-medium text-primary">{phone.successMessage}</Text>
                )}
                <SmallButton
                  label="전화번호 변경"
                  onPress={phone.changePhone}
                  disabled={!phone.canChange}
                  isLoading={phone.isChanging}
                />
              </View>

              <View className="mt-4 gap-4 rounded-card border border-border p-4">
                <SharedFormField label="주소" containerClassName="gap-2">
                  <Text className="text-xs font-pretendard-medium text-text-muted">
                    저장할 때 주소도 함께 저장돼요. 주소가 바뀌지 않았어도 현재 주소를 검색해 입력해 주세요.
                  </Text>
                  <AddressInput
                    baseAddress={info.baseAddress}
                    detailAddress={info.detailAddress}
                    onChangeBaseAddress={info.setBaseAddress}
                    onChangeDetailAddress={info.setDetailAddress}
                    boxClassName="rounded-[6px] border border-border-input px-3 py-2"
                    textClassName="text-lg text-text-body"
                  />
                </SharedFormField>
                <Text className="text-xs font-pretendard-medium text-text-muted">
                  비밀번호를 바꾸지 않으려면 아래 칸을 비워 두세요.
                </Text>
                <FormField
                  label="현재 비밀번호"
                  value={info.currentPassword}
                  onChangeText={info.setCurrentPassword}
                  secureTextEntry
                />
                <FormField
                  label="새 비밀번호"
                  value={info.newPassword}
                  onChangeText={info.setNewPassword}
                  secureTextEntry
                />
                <FormField
                  label="새 비밀번호 확인"
                  value={info.newPasswordCheck}
                  onChangeText={info.setNewPasswordCheck}
                  secureTextEntry
                />
                {!!info.errorMessage && <Text className="text-xs text-text-danger">{info.errorMessage}</Text>}
              </View>

              <Pressable
                className={`mt-4 items-center justify-center rounded-card py-4 ${
                  info.canSubmit ? 'bg-primary' : 'bg-buttonMuted'
                }`}
                onPress={info.submit}
                disabled={!info.canSubmit}>
                {info.isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.surface} />
                ) : (
                  <Text className="text-2xl font-pretendard-semibold text-surface">저장하기</Text>
                )}
              </Pressable>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

function SmallButton({
  label,
  onPress,
  disabled,
  isLoading,
  className = '',
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;
  className?: string;
}) {
  return (
    <Pressable
      className={`min-w-[72px] items-center justify-center rounded-[8px] px-3 py-2 ${
        disabled ? 'bg-buttonMuted' : 'bg-primary'
      } ${className}`}
      onPress={onPress}
      disabled={disabled}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.surface} />
      ) : (
        <Text className="text-sm font-pretendard-semibold text-surface">{label}</Text>
      )}
    </Pressable>
  );
}
