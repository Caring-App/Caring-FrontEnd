import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import type { HealthMetricSeries } from '@features/health/model';
import { colors } from '@shared/theme/colors';
import CaretCircleIcon from '@assets/icons/health/caret-circle.svg';

const CHART_WIDTH = 211;
const CHART_HEIGHT = 104;
const Y_TICK_COUNT = 5;
const POINT_RADIUS = 4;
// 점이 그래프 영역 가장자리(첫·마지막 날, 값 0)에 있으면 반지름만큼 잘려서, 점 반지름 + 선 두께만큼 안쪽에만 그림
const PLOT_PADDING = POINT_RADIUS + 2;
const PLOT_WIDTH = CHART_WIDTH - PLOT_PADDING * 2;
const PLOT_HEIGHT = CHART_HEIGHT - PLOT_PADDING * 2;

// 값 범위에 맞춰 보기 좋은 눈금 간격(1·2·5 × 10^n)으로 y축 최대값을 정함
function niceMax(maxValue: number) {
  if (maxValue <= 0) return Y_TICK_COUNT;
  const rawStep = (maxValue * 1.1) / Y_TICK_COUNT;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const step =
    [1, 2, 5, 10]
      .map(n => n * magnitude)
      .find(candidate => candidate >= rawStep) ?? 10 * magnitude;
  return step * Y_TICK_COUNT;
}

// 건강 수치 그래프 — 좌우 화살표로 걸음 수 / 혈당 / 혈압을 넘겨봄. 기록 없는 날(null)은 점을 찍지 않음
export function HealthMetricsChart({
  series,
}: {
  series: HealthMetricSeries[];
}) {
  const [index, setIndex] = useState(0);
  if (series.length === 0) return null;

  const metric = series[Math.min(index, series.length - 1)];
  const recorded = metric.values.filter(
    (value): value is number => value !== null,
  );
  const maxValue = niceMax(Math.max(0, ...recorded));
  const yAxisLabels = Array.from(
    { length: Y_TICK_COUNT + 1 },
    (_, i) => (maxValue / Y_TICK_COUNT) * (Y_TICK_COUNT - i),
  );

  const points = metric.values.flatMap((value, i) =>
    value === null
      ? []
      : [
          {
            x:
              PLOT_PADDING +
              (metric.values.length > 1
                ? (i / (metric.values.length - 1)) * PLOT_WIDTH
                : PLOT_WIDTH / 2),
            y: PLOT_PADDING + (1 - value / maxValue) * PLOT_HEIGHT,
          },
        ],
  );
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  const goToPrev = () =>
    setIndex(prev => (prev === 0 ? series.length - 1 : prev - 1));
  const goToNext = () =>
    setIndex(prev => (prev >= series.length - 1 ? 0 : prev + 1));

  return (
    <View>
      <Text className="text-center text-2xs font-pretendard-semibold text-text-primary">
        {metric.label} ({metric.unit})
      </Text>

      <View className="mt-3 flex-row items-center">
        <Pressable
          hitSlop={8}
          className="mr-4 -rotate-180"
          onPress={goToPrev}
          accessibilityLabel="이전 항목"
        >
          <CaretCircleIcon width={24} height={24} />
        </Pressable>

        <View className="flex-1 flex-row">
          <View className="mr-2 h-[104px] items-end justify-between">
            {yAxisLabels.map(label => (
              <Text key={label} className="text-2xs text-text-muted">
                {label}
              </Text>
            ))}
          </View>

          <View className="flex-1">
            {recorded.length === 0 ? (
              <View className="h-[104px] items-center justify-center">
                <Text className="text-2xs text-text-muted">
                  최근 기록이 없어요
                </Text>
              </View>
            ) : (
              <Svg
                width="100%"
                height={CHART_HEIGHT}
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              >
                {points.length > 1 && (
                  <Polyline
                    points={polylinePoints}
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth={2}
                  />
                )}
                {points.map((point, i) => (
                  <Circle
                    key={i}
                    cx={point.x}
                    cy={point.y}
                    r={POINT_RADIUS}
                    fill={colors.primary}
                  />
                ))}
              </Svg>
            )}
            <View className="mt-1 flex-row justify-between">
              {metric.dates.map((date, i) => (
                <Text key={`${date}-${i}`} className="text-2xs text-text-muted">
                  {date}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <Pressable
          hitSlop={8}
          className="ml-4"
          onPress={goToNext}
          accessibilityLabel="다음 항목"
        >
          <CaretCircleIcon width={24} height={24} />
        </Pressable>
      </View>

      <View className="mt-3 flex-row items-center justify-center gap-1">
        {series.map(item => (
          <View
            key={item.key}
            className={`h-[10px] w-[10px] rounded-full border border-border ${
              item.key === metric.key ? 'bg-primary' : 'bg-surface'
            }`}
          />
        ))}
      </View>
    </View>
  );
}
