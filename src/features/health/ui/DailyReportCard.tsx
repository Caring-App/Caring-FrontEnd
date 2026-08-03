import React, { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useHealthStatusStore, HealthStatus } from '@features/health/model';
import { useMedicationStore, MealSlot, MedicationTaken } from '@features/medication/model';
import EnvelopeFillIcon from '@assets/icons/report/envelope-fill.svg';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';
import ChevronDownIcon from '@assets/icons/action/chevron-down.svg';
import EmojiSmileOnIcon from '@assets/icons/emoji/emoji-smile-on.svg';
import EmojiSmileOffIcon from '@assets/icons/emoji/emoji-smile-off.svg';
import EmojiNeutralOnIcon from '@assets/icons/emoji/emoji-neutral-on.svg';
import EmojiNeutralOffIcon from '@assets/icons/emoji/emoji-neutral-off.svg';
import EmojiTearOnIcon from '@assets/icons/emoji/emoji-tear-on.svg';
import EmojiTearOffIcon from '@assets/icons/emoji/emoji-tear-off.svg';
import { HealthMetricsChart } from './HealthMetricsChart';
import { DropdownAnchor, TimeDropdown } from './TimeDropdown';

const HEALTH_EMOJI_ICONS: Record<HealthStatus, { on: typeof EmojiSmileOnIcon; off: typeof EmojiSmileOnIcon }> = {
  good: { on: EmojiSmileOnIcon, off: EmojiSmileOffIcon },
  normal: { on: EmojiNeutralOnIcon, off: EmojiNeutralOffIcon },
  bad: { on: EmojiTearOnIcon, off: EmojiTearOffIcon },
};

const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  good: '좋음',
  normal: '보통',
  bad: '안좋음',
};

const MEAL_SLOT_LABELS: Record<MealSlot, string> = {
  morning: '아침',
  lunch: '점심',
  dinner: '저녁',
};

function buildDailySummary(wardName: string, status: HealthStatus | null, taken: MedicationTaken | undefined) {
  if (!status || !taken) {
    return '아직 오늘의 요약 정보가 없어요.';
  }

  const missedSlot = (['morning', 'lunch', 'dinner'] as MealSlot[]).find(slot => !taken[slot]);
  const medicationClause = missedSlot
    ? `${wardName}님은 오늘 ${MEAL_SLOT_LABELS[missedSlot]}약을 복용하지 않았어요`
    : `${wardName}님은 오늘 약을 모두 잘 복용했어요`;

  return `${wardName}님의 오늘 건강 상태는 '${HEALTH_STATUS_LABELS[status]}' 이에요! ${medicationClause}`;
}

export function DailyReportCard({ wardId, wardName }: { wardId: string; wardName: string }) {
  const [showDetail, setShowDetail] = useState(false);
  const [reportTime, setReportTime] = useState('21 : 00');
  const [timeDropdownAnchor, setTimeDropdownAnchor] = useState<DropdownAnchor | null>(null);
  const timeButtonRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const status = useHealthStatusStore(state => state.statusByWard[wardId] ?? null);
  const taken = useMedicationStore(state => state.takenByWard[wardId]);

  return (
    <View className="mt-4 rounded-card border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <Pressable onPress={() => setShowDetail(prev => !prev)} hitSlop={8}>
          <View style={{ transform: [{ rotate: showDetail ? '90deg' : '0deg' }] }}>
            <ChevronRightIcon width={18} height={18} />
          </View>
        </Pressable>
        <EnvelopeFillIcon width={20} height={15} />
        <Text className="text-xl font-bold text-text-primary">하루 요약 레포트</Text>
      </View>

      <View className="mt-1 flex-row flex-wrap items-center">
        <Text className="text-xs text-text-muted">하루 요약 레포트를 매일 </Text>
        <Pressable
          ref={timeButtonRef}
          className="flex-row items-center gap-1 rounded-[6px] border border-border px-2 py-0.5"
          onPress={() => {
            timeButtonRef.current?.measureInWindow((x, y, width, height) => {
              setTimeDropdownAnchor({ x, y, width, height });
            });
          }}>
          <Text className="text-xs font-pretendard-semibold text-text-primary">{reportTime}</Text>
          <ChevronDownIcon width={10} height={7} />
        </Pressable>
        <Text className="text-xs text-text-muted"> 시에 받아요</Text>
      </View>

      <TimeDropdown
        visible={timeDropdownAnchor !== null}
        value={reportTime}
        anchor={timeDropdownAnchor}
        onClose={() => setTimeDropdownAnchor(null)}
        onSelect={setReportTime}
      />
      <Text className="mt-1 text-xs text-text-muted">
        하루 요약 레포트는 설정한 시간을 기준으로 반영됩니다
      </Text>

      <View className="mt-4 rounded-card border border-border bg-surface p-4">
        <Text className="text-md font-semibold text-text-primary">오늘의 건강 상태</Text>
        <View className="mt-3 flex-row justify-around">
          <EmojiState wardId={wardId} status="good" />
          <EmojiState wardId={wardId} status="normal" />
          <EmojiState wardId={wardId} status="bad" />
        </View>
      </View>

      <View className="mt-3 rounded-card border border-border bg-surface p-4">
        <Text className="text-md font-semibold text-text-primary">오늘 하루 요약</Text>
        <Text className="mt-2 text-sm text-text-primary">{buildDailySummary(wardName, status, taken)}</Text>
      </View>

      {showDetail && <CompoundHealthDataSection />}
    </View>
  );
}

function EmojiState({ wardId, status }: { wardId: string; status: HealthStatus }) {
  const activeStatus = useHealthStatusStore(state => state.statusByWard[wardId]);
  const { on: OnIcon, off: OffIcon } = HEALTH_EMOJI_ICONS[status];
  const isOn = activeStatus === status;

  return (
    <View className="h-[85px] w-[85px] items-center justify-center rounded-card bg-surface">
      {isOn ? <OnIcon width={60} height={60} /> : <OffIcon width={60} height={60} />}
    </View>
  );
}

function CompoundHealthDataSection() {
  return (
    <View className="mt-3 rounded-card border border-border bg-surface p-4">
      <Text className="text-md font-semibold text-text-primary">건강 수치 그래프</Text>
      <View className="mt-3">
        <HealthMetricsChart />
      </View>
    </View>
  );
}
