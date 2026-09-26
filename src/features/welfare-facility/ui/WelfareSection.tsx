import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SectionCard } from '@shared/ui';
import { colors } from '@shared/theme/colors';
import BuildingFillIcon from '@assets/icons/section/building-fill.svg';
import PinAngleFillIcon from '@assets/icons/section/pin-angle-fill.svg';
import { WELFARE_SEARCH_RADIUS_KM, WelfareFacility, useNearbyWelfareFacilities } from '../model';
import { formatDistance } from '../utils';
import { DetailLinkText } from './DetailLinkText';

// 홈 화면에는 가까운 순으로 이만큼만 미리 보여주고, 전체 목록은 "자세히 보기"(WelfareFacilityListScreen)에서 봄
const PREVIEW_COUNT = 2;

interface WelfareSectionProps {
  wardId: string;
  onPressMore?: () => void;
  onPressFacility?: (facility: WelfareFacility) => void;
}

// 보호자 홈의 "주변 공공 복지 시설" 섹션. 목록 화면과 같은 훅(스토어)을 써서, 홈에서 한 번 불러오면
// 목록 화면에 들어갈 때 다시 조회하지 않음.
export function WelfareSection({ wardId, onPressMore, onPressFacility }: WelfareSectionProps) {
  const { facilities, isLoading, errorMessage } = useNearbyWelfareFacilities(wardId);

  return (
    <SectionCard
      title="주변 공공 복지 시설"
      icon={<BuildingFillIcon width={15} height={20} />}
      action={<DetailLinkText onPress={onPressMore} />}
      className="">
      {/* 로딩/에러/결과 없음일 때만 목록 2줄 높이(h-14 두 개 + gap)만큼 자리를 잡아 섹션 높이가 들쭉날쭉하지 않게 함 —
          목록이 있을 땐 최소 높이 없이 내용 높이 그대로 써서 아래 여백이 더 생기지 않게 함 */}
      <View className={`mt-3 gap-2 ${facilities && facilities.length > 0 && !errorMessage ? '' : 'min-h-[120px]'}`}>
        {errorMessage ? (
          <SectionMessage text="시설 정보를 불러오지 못했어요." />
        ) : isLoading || !facilities ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : facilities.length === 0 ? (
          <SectionMessage text={`반경 ${WELFARE_SEARCH_RADIUS_KM}km 안에 공공 복지 시설이 없어요.`} />
        ) : (
          facilities.slice(0, PREVIEW_COUNT).map(facility => (
            <Pressable
              key={facility.id}
              onPress={() => onPressFacility?.(facility)}
              className="h-14 w-full flex-row items-center gap-2 rounded-card border border-border px-3">
              <PinAngleFillIcon width={14} height={14} />
              <Text className="flex-1 text-md font-pretendard-semibold text-text-primary" numberOfLines={1}>
                {facility.name}
              </Text>
              <Text className="text-[12px] font-pretendard-semibold text-primary">
                {formatDistance(facility.distanceKm)}
              </Text>
            </Pressable>
          ))
        )}
      </View>
    </SectionCard>
  );
}

function SectionMessage({ text }: { text: string }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-[12px] font-pretendard-medium text-text-muted">{text}</Text>
    </View>
  );
}
