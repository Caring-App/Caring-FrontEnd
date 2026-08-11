import React from 'react';
import { Image } from 'react-native';
import caringDog from '@assets/images/caring-dog.png';

interface CaringDogImageProps {
  size?: number;
}

export function CaringDogImage({ size = 240 }: CaringDogImageProps) {
  // 캐릭터가 오른쪽으로 손을 든 포즈라 시각적 무게중심이 왼쪽에 쏠려 보여, 살짝 오른쪽으로 보정
  return <Image source={caringDog} resizeMode="contain" style={{ width: size, height: size, marginLeft: 8 }} />;
}
