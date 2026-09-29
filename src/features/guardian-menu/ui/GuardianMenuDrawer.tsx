import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { useSessionStore } from '@shared/store/useSessionStore';
import { confirmLogout } from '@shared/model';
import { useSelectedWardStore } from '@features/ward-management/model';
import { useGuardianMenuStore } from '../model/useGuardianMenuStore';
import GearIcon from '@assets/icons/menu/gear-white.svg';
import PersonVcardIcon from '@assets/icons/menu/person-vcard.svg';
import ChevronRightIcon from '@assets/icons/menu/chevron-right.svg';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function GuardianMenuDrawer() {
  const isOpen = useGuardianMenuStore(state => state.isOpen);
  const close = useGuardianMenuStore(state => state.close);
  const navigation = useNavigation<GuardianStackNavigationProp>();
  const wards = useSelectedWardStore(state => state.wards);
  // 로그인 응답의 회원 이름 — 프로필이 없는 경우(세션 복원 전 등)엔 이름 없이 인사만 보여줌
  const userName = useSessionStore(state => state.profile?.name);

  if (!isOpen) {
    return null;
  }

  return (
    <View className="absolute inset-0 z-50 flex-row">
      <Pressable className="flex-1 bg-black/40" onPress={close} accessibilityLabel="메뉴 닫기" />

      <View className="w-[66%] bg-surface">
        <View className="bg-primary px-5 pb-5 pt-14">
          <Pressable
            className="absolute right-4 top-14 h-11 w-11 items-center justify-center"
            hitSlop={8}
            onPress={() => {
              close();
              navigation.navigate('Settings');
            }}>
            <GearIcon width={22} height={21} />
          </Pressable>

          <Text className="font-pretendard-semibold text-xl text-white">안녕하세요</Text>
          {!!userName && <Text className="mt-1 font-pretendard-bold text-2xl text-white">{userName}님</Text>}

          <View className="mb-4 mt-4 border-t border-white" />

          <Pressable
            className="self-start rounded-card border border-border px-4 py-2"
            onPress={() => {
              close();
              confirmLogout();
            }}>
            <Text className="font-pretendard-bold text-md text-white">로그아웃</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 bg-surface px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3">
          {wards.map(ward => (
            <Pressable
              key={ward.id}
              className="flex-row items-center gap-2 rounded-card border border-border bg-surface px-4 py-3"
              onPress={() => {
                close();
                useSelectedWardStore.getState().selectWard(ward.id);
                navigation.navigate('Tabs', { screen: 'Home' });
              }}>
              <PersonVcardIcon width={22} height={17} />
              <ChevronRightIcon width={7} height={12} />
              <Text className="font-pretendard-semibold text-md text-text-body">{ward.name}님</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
