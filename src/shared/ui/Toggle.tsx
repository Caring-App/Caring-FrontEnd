import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { colors } from '@shared/theme/colors';

// Figma 452:16784 "속성 1=기본" 토글 그대로: 50x30 트랙, 20x20 원형 썸(패딩 5px)
const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const THUMB_SIZE = 20;
const THUMB_INSET = 5;

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function Toggle({ value, onValueChange }: ToggleProps) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  const trackColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.switchTrackOff, colors.primary],
  });
  const thumbTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_INSET, TRACK_WIDTH - THUMB_SIZE - THUMB_INSET],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      hitSlop={8}>
      <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX: thumbTranslateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.surface,
  },
});
