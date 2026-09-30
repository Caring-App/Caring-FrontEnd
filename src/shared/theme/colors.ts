// Switch/TextInput 등 className을 받지 않는 네이티브 prop(trackColor, placeholderTextColor 등) 전용.
// tailwind.config.js의 theme.extend.colors를 그대로 미러링한 값이므로, 색상을 바꿀 땐 두 파일을 함께 수정할 것.
export const colors = {
  primary: '#fd7e14',
  surface: '#ffffff',
  border: '#e2e5e5',
  textPrimary: '#111111',
  textPlaceholder: '#6c757d',
  textBody: '#212529',
  textLoginPlaceholder: '#aeb5b5',
  textCalendarMuted: '#adb5bd',
  textCalendarScheduleDot: '#8e8e93',
  switchTrackOff: '#d9d9d9',
  textAuthTitle: '#1a1614',
  textAuthPlaceholder: '#bdbdbd',
  textAuthDesc: '#9e9e9e',
} as const;
