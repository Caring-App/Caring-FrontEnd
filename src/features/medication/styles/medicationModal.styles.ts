import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// 1. 고정된 스타일은 기존대로 StyleSheet.create를 사용해 최적화합니다.
const staticStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '90%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  cardBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fcfcfc',
    marginBottom: 15,
  },
  quickDayButton: {
    flex: 1,
    backgroundColor: '#777',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickDayButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectBoxText: {
    color: '#333',
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    backgroundColor: '#fafafa',
    alignItems: 'center',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#FF8C00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  wheelWrapper: {
    height: 120,
    width: 65,
    alignItems: 'center',
    overflow: 'hidden',
  },
  wheelHighlight: {
    position: 'absolute',
    top: 40,
    height: 40,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FF8C00',
    backgroundColor: 'rgba(255,140,0,0.08)',
  },
  wheelItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: 65,
  },
});

// 2. 고정 스타일(...staticStyles)과 문제가 되었던 동적 함수들을 스프레드 연산자로 합쳐서 export 합니다.
export const styles = {
  ...staticStyles,

  mealButton: (isSelected: boolean): ViewStyle => ({
    flex: 1,
    borderWidth: 1,
    borderColor: isSelected ? '#FF8C00' : '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 3,
    backgroundColor: isSelected ? 'rgba(255,140,0,0.08)' : '#fff',
  }),

  mealButtonText: (isSelected: boolean): TextStyle => ({
    fontWeight: 'bold',
    color: isSelected ? '#FF8C00' : '#666',
  }),

  dayButton: (isSelected: boolean): ViewStyle => ({
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: isSelected ? '#FF8C00' : '#ccc',
    backgroundColor: isSelected ? '#FF8C00' : '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }),

  dayButtonText: (isSelected: boolean): TextStyle => ({
    color: isSelected ? '#fff' : '#333',
    fontWeight: 'bold',
    fontSize: 13,
  }),

  wheelText: (isSelected: boolean): TextStyle => ({
    fontSize: 16,
    fontWeight: isSelected ? 'bold' : 'normal',
    color: isSelected ? '#FF8C00' : '#888',
  }),
};