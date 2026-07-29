import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import EditPencilOrangeIcon from '@assets/icons/action/edit-pencil-orange.svg';
import CloseXIcon from '@assets/icons/action/close-x.svg';
import { Ward, WardInfo } from '../model';
import { FormField } from './FormField';

export function EditWardModal({
  visible,
  ward,
  onClose,
  onSave,
}: {
  visible: boolean;
  ward: Ward | null;
  onClose: () => void;
  onSave: (info: WardInfo) => void;
}) {
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (ward) {
      setNickname(ward.nickname);
      setName(ward.name);
      setPhone(ward.phone);
      setAddress(ward.address);
    }
  }, [ward]);

  if (!ward) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/40 px-4" onPress={onClose}>
        <Pressable className="w-full max-w-[375px] rounded-card bg-surface p-4" onPress={() => {}}>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <EditPencilOrangeIcon width={24} height={22} />
              <Text className="text-xl font-pretendard-bold text-text-primary">정보 수정</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <CloseXIcon width={20} height={20} />
            </Pressable>
          </View>

          <View className="mt-4 gap-4 rounded-card border border-border p-4">
            <FormField label="별명" placeholder="ex ) 엄마" value={nickname} onChangeText={setNickname} />
            <FormField label="이름" placeholder="ex ) 홍길동" value={name} onChangeText={setName} />
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
          </View>

          <Pressable
            className="mt-4 items-center justify-center rounded-card bg-primary py-4"
            onPress={() => onSave({ nickname, name, phone, address })}>
            <Text className="text-md font-pretendard-semibold text-surface">저장하기</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
