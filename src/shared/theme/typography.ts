// className(text-xl 등, 빌드 시 고정 px로 컴파일됨)으로는 런타임에 배율을 곱할 수 없는 곳(WardText 등)
// 전용. tailwind.config.js의 theme.extend.fontSize를 그대로 미러링한 값이므로, 크기를 바꿀 땐 두 파일을
// 함께 수정할 것.
export type FontSizeToken = '2xs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl';

interface FontSizeScale {
  size: number;
  letterSpacing?: number;
}

export const FONT_SIZES: Record<FontSizeToken, FontSizeScale> = {
  '2xs': { size: 12, letterSpacing: -0.3 },
  xs: { size: 11, letterSpacing: -0.275 },
  sm: { size: 13, letterSpacing: -0.325 },
  base: { size: 14, letterSpacing: -0.35 },
  md: { size: 15, letterSpacing: -0.375 },
  lg: { size: 16, letterSpacing: -0.4 },
  '2xl': { size: 18 },
  xl: { size: 20, letterSpacing: -0.5 },
};

export const FONT_SIZE_LINE_HEIGHT_RATIO = 1.4;
