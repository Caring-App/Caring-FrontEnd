import React from 'react';
import { Image } from 'react-native';
import caringDog from '@assets/images/caring-dog.png';

interface CaringDogImageProps {
  size?: number;
}

export function CaringDogImage({ size = 240 }: CaringDogImageProps) {
  return <Image source={caringDog} resizeMode="contain" style={{ width: size, height: size }} />;
}
