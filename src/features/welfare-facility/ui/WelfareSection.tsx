import React from 'react';
import { Image, View } from 'react-native';
import { SectionCard } from '@shared/ui';
import { DetailLinkText } from './DetailLinkText';
import BuildingFillIcon from '@assets/icons/section/building-fill.svg';
import nationalSubsidyImage from '@assets/images/welfare/national-subsidy.png';
import healthWelfareImage from '@assets/images/welfare/health-welfare.png';

export function WelfareSection({ onPressMore }: { onPressMore?: () => void }) {
  return (
    <SectionCard
      title="주변 공공 복지 시설"
      icon={<BuildingFillIcon width={15} height={20} />}
      action={<DetailLinkText onPress={onPressMore} />}
      className="">
      {/* 아래 두 배너는 고정 안내용이라 API와 무관함. 실제 주변 시설 목록(GET /api/welfare-facility)은
          "자세히 보기"로 들어가는 WelfareFacilityListScreen에서 조회함 */}
      <View className="mt-3 gap-2">
        <View className="h-14 w-full flex-row items-center overflow-hidden rounded-card border border-border pl-3">
          <Image source={nationalSubsidyImage} style={{ width: 185, height: 40 }} resizeMode="contain" />
        </View>
        <View className="h-14 w-full flex-row items-center overflow-hidden rounded-card border border-border pl-3">
          <Image source={healthWelfareImage} style={{ width: 177, height: 34 }} resizeMode="contain" />
        </View>
      </View>
    </SectionCard>
  );
}
