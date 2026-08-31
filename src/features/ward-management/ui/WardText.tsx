import React from 'react';
import { Text, TextProps } from 'react-native';
import { FONT_SIZES, FONT_SIZE_LINE_HEIGHT_RATIO, FontSizeToken } from '@shared/theme/typography';
import { useWardFontScaleStore } from '../model/useWardFontScaleStore';

// 어르신 화면에서 배율을 곱하려면 className(text-xl 등, 빌드 시 고정 px로 컴파일됨)이 아니라
// shared/theme/typography.ts의 값을 직접 계산해서 써야 함.
export type WardTextSize = FontSizeToken;

interface WardTextProps extends TextProps {
  size?: WardTextSize;
}

// 어르신(WARD) 화면 전용 Text — 보호자가 돌봄대상자 관리 탭에서 설정한 글자 크기(작게/보통/크게)를
// 실제로 반영해서 렌더링함. className의 text-xl 등 크기 유틸리티 대신 이 size prop을 써야 배율이
// 적용됨(색상/폰트 굵기 등 크기 아닌 유틸리티는 className 그대로 사용 가능).
export function WardText({ size = 'base', style, ...props }: WardTextProps) {
  const scale = useWardFontScaleStore(state => state.scale);
  const { size: baseSize, letterSpacing: baseLetterSpacing } = FONT_SIZES[size];
  const fontSize = baseSize * scale;

  return (
    <Text
      {...props}
      style={[
        {
          fontSize,
          lineHeight: fontSize * FONT_SIZE_LINE_HEIGHT_RATIO,
          letterSpacing: baseLetterSpacing !== undefined ? baseLetterSpacing * scale : undefined,
        },
        style,
      ]}
    />
  );
}
