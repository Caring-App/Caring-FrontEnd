import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LoginStyles as styles } from '../styles/LoginStyles';

interface Props {
  onPress: () => void;
  color: string;
}

export const SocialButton = ({ onPress, color }: Props) => (
  <TouchableOpacity
    style={[styles.circleButton, { backgroundColor: color }]}
    onPress={onPress}
  />
);