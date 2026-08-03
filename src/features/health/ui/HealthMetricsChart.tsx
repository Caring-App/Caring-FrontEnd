import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { MOCK_HEALTH_METRICS } from '@features/health/model';
import { colors } from '@shared/theme/colors';
import CaretCircleIcon from '@assets/icons/health/caret-circle.svg';

const CHART_WIDTH = 211;
const CHART_HEIGHT = 104;

export function HealthMetricsChart() {
  const [index, setIndex] = useState(0);
  const metric = MOCK_HEALTH_METRICS[index];

  const points = metric.values.map((value, i) => ({
    x: (i / (metric.values.length - 1)) * CHART_WIDTH,
    y: CHART_HEIGHT - (value / metric.maxValue) * CHART_HEIGHT,
  }));
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  const goToPrev = () => setIndex(prev => (prev === 0 ? MOCK_HEALTH_METRICS.length - 1 : prev - 1));
  const goToNext = () => setIndex(prev => (prev === MOCK_HEALTH_METRICS.length - 1 ? 0 : prev + 1));

  return (
    <View>
      <Text className="text-center text-2xs font-pretendard-semibold text-text-primary">
        {metric.label}
      </Text>

      <View className="mt-3 flex-row items-center">
        <Pressable hitSlop={8} className="mr-4 -rotate-180" onPress={goToPrev} accessibilityLabel="이전 항목">
          <CaretCircleIcon width={24} height={24} />
        </Pressable>

        <View className="flex-1 flex-row">
          <View className="mr-2 items-end justify-between" style={{ height: CHART_HEIGHT }}>
            {metric.yAxisLabels.map(label => (
              <Text key={label} className="text-2xs text-text-muted">
                {label}
              </Text>
            ))}
          </View>

          <View className="flex-1">
            <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
              <Polyline points={polylinePoints} fill="none" stroke={colors.primary} strokeWidth={2} />
              {points.map((point, i) => (
                <Circle key={i} cx={point.x} cy={point.y} r={4} fill={colors.primary} />
              ))}
            </Svg>
            <View className="mt-1 flex-row justify-between">
              {metric.dates.map((date, i) => (
                <Text key={`${date}-${i}`} className="text-2xs text-text-muted">
                  {date}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <Pressable hitSlop={8} className="ml-4" onPress={goToNext} accessibilityLabel="다음 항목">
          <CaretCircleIcon width={24} height={24} />
        </Pressable>
      </View>

      <View className="mt-3 flex-row items-center justify-center gap-1">
        {MOCK_HEALTH_METRICS.map((item, i) => (
          <View
            key={item.key}
            className={`h-[10px] w-[10px] rounded-full border border-border ${
              i === index ? 'bg-primary' : 'bg-surface'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
