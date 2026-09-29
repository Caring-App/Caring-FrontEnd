import React from 'react';
import { Text, View } from 'react-native';
import CaringLogoMark from '@assets/icons/logo/caring-logo-mark.svg';
import CaringLogoMarkWhite from '@assets/icons/logo/caring-logo-mark-white.svg';

interface CaringLogoProps {
  size?: number;
}

// 새 로고 심볼(Figma Logo 960:3, Type=Icon) — 오렌지 곡선 배지 + C 링 마크
export function CaringLogo({ size = 40 }: CaringLogoProps) {
  return <CaringLogoMark width={size} height={size} />;
}

// 가로형 로고(Figma Logo 960:5, Type=Horizontal) — 인증/회원가입 화면 좌상단 헤더용. 심볼 40 + 워드마크 30px
export function CaringLogoHorizontal() {
  return (
    <View className="flex-row items-center gap-3">
      <CaringLogoMark width={40} height={40} />
      <Text className="font-pretendard-bold text-[30px] tracking-[-0.6px] text-text-logo">Caring</Text>
    </View>
  );
}

// 오렌지 배경(스플래시/시작 화면, Figma 964:5514) 위에 올리는 흰색 로고 — 반투명 흰 배지 64 + 흰 워드마크 48px
export function CaringLogoOnBrand() {
  return (
    <View className="flex-row items-center gap-[5px]">
      <CaringLogoMarkWhite width={64} height={64} />
      <Text className="font-pretendard-bold text-[48px] leading-[56px] tracking-[-1.5px] text-white">Caring</Text>
    </View>
  );
}
