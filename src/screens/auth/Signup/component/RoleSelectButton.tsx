import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { signupTypeSelectStyles } from '../styles/signupTypeSelect.styles';

interface RoleSelectButtonProps {
  title: string;
  onPress: () => void;
}

export default function RoleSelectButton({ title, onPress }: RoleSelectButtonProps) {
  return (
    <TouchableOpacity 
      style={signupTypeSelectStyles.selectButton}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={signupTypeSelectStyles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}