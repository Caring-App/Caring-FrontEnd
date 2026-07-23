import { StyleSheet } from 'react-native';

export const birthDatePickerStyles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  mainInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    color: '#000',
  },
  calendarBox: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeBtn: {
    marginTop: 6,
    backgroundColor: '#f1f3f5',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  closeText: {
    color: '#495057',
    fontSize: 12,
    fontWeight: '600',
  },
});