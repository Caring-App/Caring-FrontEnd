import React from 'react';
import { Text, TextProps } from 'react-native';
import { useWardFontScaleStore } from '../model/useWardFontScaleStore';

// tailwind.config.js의 theme.extend.fontSize와 동일한 값 — 어르신 화면에서 배율을 곱하려면
// className(text-xl 등, 빌드 시 고정 px로 컴파일됨)이 아니라 이 표를 직접 계산해서 써야 함.
export type WardTextSize = '2xs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl';

const SIZE_PX: Record<WardTextSize, number> = {
  '2xs': 12,
  xs: 11,
  sm: 13,
  base: 14,
  md: 15,
  lg: 16,
  xl: 20,
  '2xl': 18,
};

const LETTER_SPACING_PX: Partial<Record<WardTextSize, number>> = {
  '2xs': -0.3,
  xs: -0.275,
  sm: -0.325,
  base: -0.35,
  md: -0.375,
  lg: -0.4,
  xl: -0.5,
};

const LINE_HEIGHT_RATIO = 1.4;

interface WardTextProps extends TextProps {
  size?: WardTextSize;
}

// 어르신(WARD) 화면 전용 Text — 보호자가 돌봄대상자 관리 탭에서 설정한 글자 크기(작게/보통/크게)를
// 실제로 반영해서 렌더링함. className의 text-xl 등 크기 유틸리티 대신 이 size prop을 써야 배율이
// 적용됨(색상/폰트 굵기 등 크기 아닌 유틸리티는 className 그대로 사용 가능).
export function WardText({ size = 'base', style, ...props }: WardTextProps) {
  const scale = useWardFontScaleStore(state => state.scale);
  const fontSize = SIZE_PX[size] * scale;
  const letterSpacingBase = LETTER_SPACING_PX[size];

  return (
    <Text
      {...props}
      style={[
        {
          fontSize,
          lineHeight: fontSize * LINE_HEIGHT_RATIO,
          letterSpacing: letterSpacingBase !== undefined ? letterSpacingBase * scale : undefined,
        },
        style,
      ]}
    />
  );
}
