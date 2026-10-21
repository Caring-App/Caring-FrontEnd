import React from 'react';
import { Text, View } from 'react-native';
import { TourTarget } from '@features/guardian-tour/ui';
import type { HealthMetricSeries } from '../model';
import { HealthMetricsChart } from './HealthMetricsChart';

// 하루 요약 레포트 카드를 펼쳤을 때 보이는 "건강 수치 그래프"(최근 7일 걸음 수·혈당·혈압)
export function HealthGraphSection({ series, isLoading }: { series: HealthMetricSeries[] | null; isLoading: boolean }) {
  return (
    <TourTarget id="dailyReport.chart" className="mt-3 rounded-card border border-border bg-surface p-4">
      <Text className="text-md font-semibold text-text-primary">건강 수치 그래프</Text>
      <View className="mt-3">
        {series ? (
          <HealthMetricsChart series={series} />
        ) : (
          <Text className="text-center text-2xs text-text-muted">
            {isLoading ? '그래프를 불러오는 중이에요' : '그래프를 불러오지 못했어요'}
          </Text>
        )}
      </View>
    </TourTarget>
  );
}
