import React from 'react';
import { Image } from 'react-native';
import caringLogo from '@assets/images/header/caring-logo.png';

interface CaringLogoProps {
  size?: number;
}

export function CaringLogo({ size = 40 }: CaringLogoProps) {
  return <Image source={caringLogo} resizeMode="contain" style={{ width: size, height: size }} />;
}
