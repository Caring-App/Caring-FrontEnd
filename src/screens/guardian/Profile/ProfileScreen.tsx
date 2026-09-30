import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import { AppHeader } from '@shared/ui';
import { useSessionStore } from '@shared/store/useSessionStore';
import { confirmLogout } from '@shared/model';
import { useGuardianMenuStore } from '@features/guardian-menu/model';
import { useTourStore } from '@features/guardian-tour/model';
import {
  EditPersonalInfoModal,
  LinkCodeModal,
  MenuListItem,
  ProfileCard,
} from '@features/mypage/ui';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function ProfileScreen() {
  const navigation = useNavigation();
  const stackNavigation = navigation.getParent<GuardianStackNavigationProp>();
  // 이름은 로그인한 회원 정보(세션)에서 가져옴 — 사이드바(GuardianMenuDrawer)와 같은 출처라 세션 이름이 바뀌면 둘 다 함께 바뀜
  const userName = useSessionStore(state => state.profile?.name);
  const displayName = userName ? `${userName}님` : '';
  const [editModalVisible, setEditModalVisible] = useState(false);
  // 개인 정보 수정 모달은 열 때마다 빈 입력으로 시작해야 해서 key를 바꿔 새로 마운트
  const [editModalKey, setEditModalKey] = useState(0);
  const [linkCodeModalVisible, setLinkCodeModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <AppHeader
        onPressBell={() => stackNavigation?.navigate('Notification')}
        onPressMenu={() => useGuardianMenuStore.getState().open()}
      />
      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}>
        <Text className="mt-4 pl-4 text-xl font-pretendard-semibold text-text-primary">마이페이지</Text>

        <View className="mt-4">
          <ProfileCard
            name={displayName}
            onPressEditInfo={() => {
              setEditModalKey(key => key + 1);
              setEditModalVisible(true);
            }}
            onPressLinkCode={() => setLinkCodeModalVisible(true)}
          />
        </View>

        <View className="mt-6 border-t border-border-divider pl-4">
          <MenuListItem label="설정" onPress={() => stackNavigation?.navigate('Settings')} />
          <MenuListItem label="문의하기" onPress={() => stackNavigation?.navigate('Inquiry')} />
          <MenuListItem
            label="사용 가이드 안내"
            onPress={() => {
              useTourStore.getState().requestAutoStart();
              stackNavigation?.navigate('Tabs', { screen: 'Home' });
            }}
          />
          <MenuListItem label="정책 및 약관" onPress={() => stackNavigation?.navigate('Policy')} />
          <MenuListItem label="로그아웃" onPress={confirmLogout} />
        </View>
      </ScrollView>

      <EditPersonalInfoModal
        key={editModalKey}
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      />

      <LinkCodeModal
        visible={linkCodeModalVisible}
        name={displayName}
        onClose={() => setLinkCodeModalVisible(false)}
      />
    </SafeAreaView>
  );
}
