import React from 'react';
import { Alert, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { GuardianStackParamList } from '@app/navigation/types';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import { FacilityInfoRow } from '@features/welfare-facility/ui';
import { formatDistance, toHomepageUrl } from '@features/welfare-facility/utils';

// 전화 앱이 없는 기기(태블릿 등)나 형식이 이상한 홈페이지 주소면 openURL이 실패함 — 눌러도 아무 반응이 없지 않게 알림
function openUrl(url: string, failMessage: string) {
  Linking.openURL(url).catch(() => Alert.alert('', failMessage));
}

type WelfareFacilityDetailRouteProp = RouteProp<GuardianStackParamList, 'WelfareFacilityDetail'>;

export function WelfareFacilityDetailScreen() {
  const navigation = useNavigation();
  // 백엔드 응답에 시설 고유 id가 없어서 id로 재조회할 수 없음 — 목록에서 받은 시설 정보를 그대로 넘겨받음
  const { facility } = useRoute<WelfareFacilityDetailRouteProp>().params;
  const { phone, homepage } = facility;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} className="-rotate-180">
          <ChevronRightIcon width={24} height={24} />
        </Pressable>
        <Text className="flex-1 text-xl font-bold text-text-primary" numberOfLines={1}>
          {facility.name}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8" showsVerticalScrollIndicator={false}>
        <View className="mt-4 gap-1.5">
          <FacilityInfoRow label="거리" value={`어르신 등록 주소에서 ${formatDistance(facility.distanceKm)}`} />
          {facility.operator && <FacilityInfoRow label="운영 법인" value={facility.operator} />}
          {phone && (
            <FacilityInfoRow
              label="문의 전화번호"
              value={phone}
              onPress={() => openUrl(`tel:${phone}`, '전화를 걸 수 없어요.')}
            />
          )}
          {facility.address && <FacilityInfoRow label="주소" value={facility.address} />}
          {homepage && (
            <FacilityInfoRow
              label="홈페이지"
              value={homepage}
              onPress={() => openUrl(toHomepageUrl(homepage), '홈페이지를 열 수 없어요.')}
            />
          )}
        </View>

        {phone && (
          <Pressable
            onPress={() => openUrl(`tel:${phone}`, '전화를 걸 수 없어요.')}
            className="mt-6 items-center justify-center rounded-card bg-primary py-4">
            <Text className="text-xl font-pretendard-semibold text-surface">전화 걸기</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
