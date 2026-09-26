import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import EditPencilOrangeIcon from '@assets/icons/action/edit-pencil-orange.svg';
import CloseXIcon from '@assets/icons/action/close-x.svg';
import { AddressInput, FormField as SharedFormField } from '@shared/ui';
import { Ward, WardInfoUpdate } from '../model';
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
  onSave: (update: WardInfoUpdate) => void;
}) {
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // 새로 검색해서 바꿀 주소 — 비어 있으면 주소는 변경하지 않음(현재 주소는 ward.address로 표시만 함)
  const [newBaseAddress, setNewBaseAddress] = useState('');
  const [newDetailAddress, setNewDetailAddress] = useState('');

  useEffect(() => {
    if (ward) {
      setNickname(ward.nickname);
      setName(ward.name);
      setPhone(ward.phone);
      setNewBaseAddress('');
      setNewDetailAddress('');
    }
  }, [ward]);

  const handleSave = () =>
    onSave({
      nickname,
      name,
      phone,
      newAddress: newBaseAddress ? { baseAddress: newBaseAddress, detailAddress: newDetailAddress } : undefined,
    });

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
            {/* 상세 조회 응답엔 합쳐진 주소만 있어서 기존 주소를 검색칸에 채워 넣을 수 없음 — 현재 주소는 보여주기만 하고,
                바꿀 때만 새로 검색하게 함(주소를 바꾸면 백엔드가 어르신 좌표도 다시 계산함) */}
            <SharedFormField
              label="주소"
              containerClassName="gap-2"
              labelClassName="text-md font-pretendard-semibold text-text-strong">
              <Text className="text-base text-text-primary">{ward.address || '등록된 주소가 없어요'}</Text>
              <AddressInput
                baseAddress={newBaseAddress}
                detailAddress={newDetailAddress}
                onChangeBaseAddress={setNewBaseAddress}
                onChangeDetailAddress={setNewDetailAddress}
                boxClassName="rounded-[6px] border border-border-input px-3 py-2"
                textClassName="text-base text-text-primary"
              />
              {!!newBaseAddress && (
                <Pressable
                  onPress={() => {
                    setNewBaseAddress('');
                    setNewDetailAddress('');
                  }}
                  hitSlop={8}
                  className="self-end">
                  <Text className="border-b border-border-link text-xs font-pretendard-medium text-text-link">
                    주소 변경 취소
                  </Text>
                </Pressable>
              )}
            </SharedFormField>
          </View>

          <Pressable
            className="mt-4 items-center justify-center rounded-card bg-primary py-4"
            onPress={handleSave}>
            <Text className="text-md font-pretendard-semibold text-surface">저장하기</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
