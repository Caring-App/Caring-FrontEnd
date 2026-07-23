import { useState } from 'react';

export function useBirthDatePicker(initialDate: string, onChange: (date: string) => void) {
  const [isOpen, setIsOpen] = useState(true);

  const handleDayPress = (day: { dateString: string }) => {
    onChange(day.dateString);
    // 선택 후 닫고 싶다면 아래 주석을 해제하세요
    // setIsOpen(false);
  };

  const toggleOpen = () => setIsOpen(prev => !prev);
  const closeCalendar = () => setIsOpen(false);

  return {
    isOpen,
    toggleOpen,
    closeCalendar,
    handleDayPress,
  };
}