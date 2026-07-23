import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import CloseXIcon from '@assets/icons/action/close-x.svg';
import { ProfileInfo } from '../model';
import { FormField } from './FormField';

export function EditPersonalInfoModal({
  visible,
  profile,
  onClose,
  onSave,
}: {
  visible: boolean;
  profile: ProfileInfo;
  onClose: () => void;
  onSave: (info: { phone: string; address: string; password: string }) => void;
}) {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  useEffect(() => {
    if (visible) {
      setPhone(profile.phone);
      setAddress(profile.address);
      setCurrentPassword('');
      setPassword('');
      setPasswordConfirm('');
    }
  }, [visible, profile]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/30 px-4" onPress={onClose}>
        <Pressable className="w-full max-w-[375px] rounded-card bg-surface p-4" onPress={() => {}}>
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-pretendard-bold text-text-primary">개인 정보 수정</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <CloseXIcon width={20} height={20} />
            </Pressable>
          </View>

          <View className="mt-4 gap-4 rounded-card border border-border p-4">
            <FormField
              label="전화번호"
              placeholder="ex ) 010-1111-2222"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <FormField
              label="주소"
              placeholder="ex ) 서울시 구로구 고척동 111-11"
              value={address}
              onChangeText={setAddress}
            />
            <FormField
              label="현재 비밀번호"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
            <View className="flex-row items-end gap-2">
              <View className="flex-1">
                <FormField
                  label="비밀번호"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
              <Pressable className="items-center justify-center rounded-[8px] bg-primary px-4 py-1.5">
                <Text className="text-sm font-pretendard-semibold text-surface">변경</Text>
              </Pressable>
            </View>
            <FormField
              label="비밀번호 확인"
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              secureTextEntry
            />
          </View>

          <Pressable
            className="mt-4 items-center justify-center rounded-card bg-primary py-4"
            onPress={() => onSave({ phone, address, password })}>
            <Text className="text-md font-pretendard-semibold text-surface">저장하기</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
