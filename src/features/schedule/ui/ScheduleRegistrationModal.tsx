import React, { useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import CalendarEventIcon from '@assets/icons/section/calendar-event.svg';
import CloseIcon from '@assets/icons/action/close-x.svg';
import ChevronDownIcon from '@assets/icons/section/chevron-down-select.svg';
import { FormLabel, SoundSettingsCard, TimeTriggerInput, WheelTimePicker, formatTime } from '@shared/ui';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 사용가이드가 이 모달 내부(카드 전체 /
// 시간 섹션)를 직접 하이라이트해야 해서 guardian-tour를 의도적으로 참조함(순환참조 없음).
// 화면 계층으로 끌어올리는 대안도 검토했으나 ref/콜백 prop-drilling이 늘어나 오히려 가독성이 떨어져 보류.
import { useHostModalTourStep, useTourStore } from '@features/guardian-tour/model';
import { TourOverlayContent } from '@features/guardian-tour/ui';
import { LOCATION_OPTIONS, useScheduleRegistrationForm } from '../model/useScheduleRegistrationForm';
import { ScheduleEntry } from '../model/scheduleRegistrationTypes';
import { ScheduleCalendarPicker } from './ScheduleCalendarPicker';

interface ScheduleRegistrationModalProps {
  visible: boolean;
  wardId: string;
  wardName: string;
  editingSchedule: ScheduleEntry | null;
  onClose: () => void;
}

export function ScheduleRegistrationModal({
  visible,
  wardId,
  wardName,
  editingSchedule,
  onClose,
}: ScheduleRegistrationModalProps) {
  const cardRef = useRef<View>(null);
  const timeSectionRef = useRef<View>(null);
  const formScrollRef = useRef<ScrollView>(null);

  // 사용가이드가 등록 모달을 열자마자(같은 마운트에서) 바로 위치를 재려고 하므로, 대상 ref 등록이
  // useTourSpotlight의 effect보다 먼저 실행되어야 함 — 그래서 이 effect를 반드시 먼저 선언함
  useEffect(() => {
    useTourStore.getState().registerTargetRef('schedule.registerModal', cardRef);
    useTourStore.getState().registerTargetRef('schedule.registerModal.timeSection', timeSectionRef);
    useTourStore.getState().registerScrollRef('scheduleRegisterModal', formScrollRef);
  }, []);

  // 사용가이드가 "일정 등록" 단계에 도달하면 이 모달을 스스로 열어서 보여줌
  const { isTourStep, tourStep, tourStepIndex, ready, box } = useHostModalTourStep('scheduleRegisterModal');
  // "일정 시간 / 음성 알림 시간" 하이라이트 단계에서는 두 휠 피커를 다 펼쳐서 보여줌
  const isTimeSectionStep = isTourStep && tourStep?.targetId === 'schedule.registerModal.timeSection';
  // 폼 훅에도 사용가이드가 강제로 연 경우를 같이 알려줘야, 이전에 수동으로 열었다 저장 없이 닫아서
  // 남아있던 값이 아니라 항상 깨끗한 상태로 초기화됨(훅 내부는 visible이 켜질 때만 리셋함)
  const { state, actions } = useScheduleRegistrationForm(wardId, visible || isTourStep, editingSchedule, onClose);

  return (
    <Modal visible={visible || isTourStep} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/30 px-5">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="w-full max-h-[85%]">
        <View ref={cardRef} className="max-h-full rounded-card border border-border bg-surface p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <CalendarEventIcon width={20} height={20} />
              <Text className="font-pretendard-bold text-xl text-text-primary">
                {wardName}님 일정 {editingSchedule ? '수정' : '등록'}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <CloseIcon width={16} height={16} />
            </Pressable>
          </View>

          <ScrollView
            ref={formScrollRef}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={event =>
              useTourStore.getState().setScrollOffset('scheduleRegisterModal', event.nativeEvent.contentOffset.y)
            }
            onMomentumScrollEnd={() => useTourStore.getState().notifyScrollSettled()}>
            <View className="gap-5 rounded-card border border-border px-3.5 pb-3.5 pt-5">
              <View>
                <FormLabel>일정 이름</FormLabel>
                <TextInput
                  value={state.title}
                  onChangeText={actions.setTitle}
                  placeholder="일정 이름을 입력하세요"
                  placeholderTextColor="#6C757D"
                  className="rounded-md border border-border-input px-3.5 py-2 font-pretendard text-lg text-text-primary"
                />
              </View>

              <View>
                <FormLabel>장소</FormLabel>
                <Pressable
                  onPress={actions.toggleLocationOptions}
                  className="flex-row items-center justify-between rounded-md border border-border-input px-3.5 py-2">
                  <Text className={`font-pretendard text-lg ${state.location ? 'text-text-primary' : 'text-text-placeholder'}`}>
                    {state.location || '장소를 선택 하세요'}
                  </Text>
                  <ChevronDownIcon width={11} height={7} />
                </Pressable>
                {state.showLocationOptions && (
                  <View className="mt-1 rounded-md border border-border-divider bg-surface py-1">
                    {LOCATION_OPTIONS.map((option) => (
                      <Pressable key={option} onPress={() => actions.selectLocation(option)} className="px-4 py-2">
                        <Text className="font-pretendard text-lg text-text-body">{option}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <ScheduleCalendarPicker
                month={state.calendarMonth}
                selectedDate={state.selectedDate}
                onPrevMonth={actions.goToPrevMonth}
                onNextMonth={actions.goToNextMonth}
                onSelectDate={actions.selectDate}
              />
            </View>

            <View ref={timeSectionRef} className="mt-5 gap-5">
              <View>
                <FormLabel>일정 시간</FormLabel>
                <TimeTriggerInput
                  placeholder="일정 시간을 선택하세요"
                  valueLabel={state.hasScheduleTime ? formatTime(state.scheduleTime) : undefined}
                  onPress={actions.toggleSchedulePicker}
                />
                {(state.showSchedulePicker || isTimeSectionStep) && (
                  <View className="mt-2">
                    <WheelTimePicker value={state.scheduleTime} onChange={actions.setScheduleTime} />
                  </View>
                )}
              </View>

              <View>
                <FormLabel>음성 알림 시간</FormLabel>
                <TimeTriggerInput
                  placeholder="알림을 전달 할 시간을 선택하세요"
                  valueLabel={state.hasAlarmTime ? formatTime(state.alarmTime) : undefined}
                  onPress={actions.toggleAlarmPicker}
                />
                {(state.showAlarmPicker || isTimeSectionStep) && (
                  <View className="mt-2">
                    <WheelTimePicker value={state.alarmTime} onChange={actions.setAlarmTime} />
                  </View>
                )}
              </View>
            </View>

            <SoundSettingsCard
              soundType={state.soundType}
              onChangeSoundType={actions.setSoundType}
              isRecording={state.isRecording}
              onRecord={actions.handleRecord}
              onPlay={actions.handlePlay}
              onDelete={actions.handleDeleteRecording}
            />

            <Pressable
              onPress={actions.handleSave}
              className="mt-5 items-center justify-center rounded-md bg-primary py-4">
              <Text className="font-pretendard-semibold text-xl text-white">저장하기</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      </View>

      {isTourStep && tourStep && (
        <TourOverlayContent
          step={tourStep}
          currentStepIndex={tourStepIndex}
          showSpotlight={ready && !!box}
          box={box}
        />
      )}
    </Modal>
  );
}
