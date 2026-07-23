import React from 'react';
import { Svg, Circle, Path } from 'react-native-svg';

// 시계 아이콘
export const ClockIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#888" strokeWidth="1.8" />
    <Path d="M12 7V12L15 14" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 녹음 마이크 아이콘 (피그마 스타일 - 내부 색상 채움)
export const MicIcon = ({ color = '#FF8C00' }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path 
      d="M12 2C10.3431 2 9 3.34315 9 5V11C9 12.6569 10.3431 14 12 14C13.6569 14 15 12.6569 15 11V5C15 3.34315 13.6569 2 12 2Z" 
      fill={color} 
      stroke={color} 
      strokeWidth="1" 
    />
    <Path d="M19 10V11C19 14.866 15.866 18 12 18C8.13401 18 5 14.866 5 11V10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <Path d="M12 18V22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

// 재생 삼각형 아이콘
export const PlayIcon = ({ color = '#FF8C00' }: { color?: string }) => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path d="M5 3L19 12L5 21V3Z" fill={color} stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

// 삭제 X 아이콘
export const CloseIcon = ({ color = '#FF8C00' }: { color?: string }) => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);