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
      {/* TODO: features/location 실제 위치 기반 공공 시설 추천 API 연동. 아래 두 배너는
          고정 안내용이라 자세히 보기 리스트와 별개임. */}
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
