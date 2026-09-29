import React from 'react';
import { Text, View } from 'react-native';
import { TourTarget } from '@features/guardian-tour/ui';
import type { WardDailyReportData } from '../model';
import { buildSummaryStatLines, formatReportTimeLabel } from '../utils';

interface DailyReportSummaryProps {
  data: WardDailyReportData & { reportTime: string };
  // 레포트가 아직 없을 때 보여줄 실시간 요약 문구(기분·복약)
  liveSummary: string;
}

// 하루 요약 레포트 카드의 "오늘 하루 요약" — 레포트 시각이 지나면 서버가 만든 AI 요약을,
// 그 전에는 지금까지의 기록으로 만든 요약과 레포트 예정 시각을 보여줌
export function DailyReportSummary({ data, liveSummary }: DailyReportSummaryProps) {
  return (
    <TourTarget id="dailyReport.summary" className="mt-3 rounded-card border border-border bg-surface p-4">
      <Text className="text-md font-semibold text-text-primary">오늘 하루 요약</Text>
      <Text className="mt-2 text-sm text-text-primary">{data.report?.healthSummary || liveSummary}</Text>
      {!data.report && (
        <Text className="mt-1 text-xs text-text-muted">
          {formatReportTimeLabel(data.reportTime)}에 오늘의 레포트가 만들어져요
        </Text>
      )}
      <View className="mt-3 gap-1">
        {buildSummaryStatLines(data).map(line => (
          <Text key={line} className="text-sm text-text-primary">
            {line}
          </Text>
        ))}
      </View>
    </TourTarget>
  );
}
