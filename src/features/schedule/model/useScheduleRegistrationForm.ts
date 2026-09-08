import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useVoiceRecording } from '@shared/model';
import { logApiError } from '@shared/api';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, "장소" 선택이 곧 @features/place가 관리하는
// 실제 등록된 장소를 고르는 것이라 의도적으로 참조함(순환참조 없음, place는 schedule을 참조하지 않음).
import { Place, usePlaceStore } from '@features/place/model';
import { addMonths } from './calendarUtils';
import { ScheduleEntry, ScheduleRegistrationData, ScheduleSoundType, TimeState } from './scheduleRegistrationTypes';
import { useScheduleStore } from './useScheduleStore';

const INITIAL_TIME: TimeState = { hour: '1', minute: '00', second: '00', amPm: 'AM' };

const EMPTY_PLACES: Place[] = [];

export const useScheduleRegistrationForm = (
  wardId: string,
  visible: boolean,
  editingSchedule: ScheduleEntry | null,
  onClose: () => void,
) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [placeId, setPlaceId] = useState<number | null>(null);
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [isPlacePickerVisible, setIsPlacePickerVisible] = useState(false);
  const places = usePlaceStore(state => state.placesByWard[wardId]) ?? EMPTY_PLACES;

  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [scheduleTime, setScheduleTimeState] = useState<TimeState>(INITIAL_TIME);
  const [showSchedulePicker, setShowSchedulePicker] = useState(false);
  const [hasScheduleTime, setHasScheduleTime] = useState(false);

  const [alarmTime, setAlarmTimeState] = useState<TimeState>(INITIAL_TIME);
  const [showAlarmPicker, setShowAlarmPicker] = useState(false);
  const [hasAlarmTime, setHasAlarmTime] = useState(false);

  const [soundType, setSoundType] = useState<ScheduleSoundType>('tts');
  const voiceRecording = useVoiceRecording();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }
    if (editingSchedule) {
      setTitle(editingSchedule.title);
      setLocation(editingSchedule.location);
      setPlaceId(editingSchedule.placeId);
      setCalendarMonth(editingSchedule.date);
      setSelectedDate(editingSchedule.date);
      setScheduleTimeState(editingSchedule.scheduleTime);
      setHasScheduleTime(true);
      setAlarmTimeState(editingSchedule.alarmTime);
      setHasAlarmTime(true);
      setSoundType(editingSchedule.soundType);
    } else {
      const now = new Date();
      setTitle('');
      setLocation('');
      setPlaceId(null);
      setCalendarMonth(now);
      setSelectedDate(now);
      setScheduleTimeState(INITIAL_TIME);
      setHasScheduleTime(false);
      setAlarmTimeState(INITIAL_TIME);
      setHasAlarmTime(false);
      setSoundType('tts');
    }
    setShowLocationOptions(false);
    setIsPlacePickerVisible(false);
    setShowSchedulePicker(false);
    setShowAlarmPicker(false);
    voiceRecording.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editingSchedule]);

  // 모달이 열려있는 동안엔 장소 드롭다운을 열 때마다 최신 목록을 봐야 하므로 visible 기준으로 조회.
  // wardId가 아직 유효한 숫자가 아니면(어르신 미연동 등) useWardSchedules와 동일하게 조회를 건너뜀.
  useEffect(() => {
    if (visible && !Number.isNaN(Number(wardId))) {
      usePlaceStore.getState().fetchPlaces(wardId);
    }
  }, [visible, wardId]);

  const toggleLocationOptions = () => setShowLocationOptions((prev) => !prev);
  const selectPlace = (place: Place) => {
    setLocation(place.placeName);
    setPlaceId(place.placeId);
    setShowLocationOptions(false);
  };
  const openPlacePicker = () => {
    setShowLocationOptions(false);
    setIsPlacePickerVisible(true);
  };
  const closePlacePicker = () => setIsPlacePickerVisible(false);
  const handlePlaceCreated = (place: Place) => {
    setLocation(place.placeName);
    setPlaceId(place.placeId);
    setIsPlacePickerVisible(false);
  };
  const deletePlaceOption = (place: Place) => {
    Alert.alert('', `'${place.placeName}'을(를) 삭제하시겠어요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await usePlaceStore.getState().deletePlace(wardId, place.placeId);
            if (placeId === place.placeId) {
              setLocation('');
              setPlaceId(null);
            }
          } catch (error) {
            logApiError('장소 삭제 실패', error);
            Alert.alert('', '삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
          }
        },
      },
    ]);
  };

  const goToPrevMonth = () => setCalendarMonth((prev) => addMonths(prev, -1));
  const goToNextMonth = () => setCalendarMonth((prev) => addMonths(prev, 1));
  const selectDate = (date: Date) => setSelectedDate(date);

  const toggleSchedulePicker = () => setShowSchedulePicker((prev) => !prev);
  const toggleAlarmPicker = () => setShowAlarmPicker((prev) => !prev);

  const setScheduleTime = (next: TimeState) => {
    setScheduleTimeState(next);
    setHasScheduleTime(true);
  };
  const setAlarmTime = (next: TimeState) => {
    setAlarmTimeState(next);
    setHasAlarmTime(true);
  };

  const handleSave = async () => {
    if (isSubmitting) {
      return;
    }
    const wardIdNumber = Number(wardId);
    if (Number.isNaN(wardIdNumber)) {
      Alert.alert('', '연동된 어르신 정보를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('', '일정 이름을 입력해주세요.');
      return;
    }
    if (placeId == null) {
      Alert.alert('', '장소를 선택해주세요.');
      return;
    }
    if (!hasScheduleTime) {
      Alert.alert('', '일정 시간을 선택해주세요.');
      return;
    }
    if (!hasAlarmTime) {
      Alert.alert('', '음성 알림 시간을 선택해주세요.');
      return;
    }

    const data: ScheduleRegistrationData = {
      title,
      location,
      placeId,
      date: selectedDate,
      scheduleTime,
      alarmTime,
      soundType,
    };
    setIsSubmitting(true);
    try {
      if (editingSchedule) {
        await useScheduleStore.getState().updateSchedule(wardId, editingSchedule.id, data);
      } else {
        await useScheduleStore.getState().addSchedule(wardId, data);
      }
      onClose();
    } catch (error) {
      logApiError('일정 저장 실패', error);
      Alert.alert('', '저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: {
      title,
      location,
      placeId,
      places,
      showLocationOptions,
      isPlacePickerVisible,
      calendarMonth,
      selectedDate,
      scheduleTime,
      showSchedulePicker,
      hasScheduleTime,
      alarmTime,
      showAlarmPicker,
      hasAlarmTime,
      soundType,
      isRecording: voiceRecording.isRecording,
      hasRecorded: voiceRecording.hasRecorded,
      isSubmitting,
    },
    actions: {
      setTitle,
      toggleLocationOptions,
      selectPlace,
      openPlacePicker,
      closePlacePicker,
      handlePlaceCreated,
      deletePlaceOption,
      goToPrevMonth,
      goToNextMonth,
      selectDate,
      setScheduleTime,
      toggleSchedulePicker,
      setAlarmTime,
      toggleAlarmPicker,
      setSoundType,
      handleRecord: voiceRecording.handleRecord,
      handlePlay: voiceRecording.handlePlay,
      handleDeleteRecording: voiceRecording.handleDeleteRecording,
      handleSave,
    },
  };
};
