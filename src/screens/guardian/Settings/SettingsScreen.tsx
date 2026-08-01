import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GuardianStackParamList } from '@app/navigation/types';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { SettingsToggleRow } from '@features/mypage/ui';

type GuardianStackNavigationProp = NativeStackNavigationProp<GuardianStackParamList>;

export function SettingsScreen() {
  const navigation = useNavigation<GuardianStackNavigationProp>();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [locationTermsAgreed, setLocationTermsAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="text-xl font-pretendard-semibold text-text-primary">설정</Text>
      </View>

      <View className="px-4">
        <SettingsToggleRow label="APP 푸시 알림" value={pushEnabled} onValueChange={setPushEnabled} />
        <SettingsToggleRow
          label="위치 정보 서비스 이용약관 동의"
          value={locationTermsAgreed}
          onValueChange={setLocationTermsAgreed}
        />
        <SettingsToggleRow
          label="마케팅 활용 동의"
          value={marketingAgreed}
          onValueChange={setMarketingAgreed}
        />
        <Pressable className="py-3" onPress={() => navigation.navigate('Withdrawal')}>
          <Text className="text-xl font-pretendard-bold text-text-heading">회원 탈퇴</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
