import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF', // surface.DEFAULT
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111111', // text.primary
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#656C6C', // text.muted
    padding: 5,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111111', // text.primary
  },
  input: {
    borderWidth: 1,
    borderColor: '#CED4DA', // border.input
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF', // surface.DEFAULT
    color: '#111111', // text.primary
  },
  timePickerBox: {
    borderWidth: 1,
    borderColor: '#CED4DA', // border.input
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF', // surface.DEFAULT
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timePickerText: {
    color: '#111111', // text.primary
    fontWeight: 'bold',
  },
  wheelPickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E5E5', // border.DEFAULT
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
    backgroundColor: '#FFFFFF', // surface.subtle
    alignItems: 'center',
  },
  wheelPickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  colonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 2,
    color: '#111111', // text.primary
  },
  voiceBox: {
    borderWidth: 1,
    borderColor: '#E2E5E5', // border.DEFAULT
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#FFFFFF', // surface.subtle
    marginBottom: 15,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#FF7F00', // primary.DEFAULT
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF7F00', // primary.DEFAULT
  },
  actionButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingLeft: 26,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#FF7F00', // primary.DEFAULT
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // surface.DEFAULT
  },
  actionBtnText: {
    fontSize: 13,
    color: '#FF7F00', // primary.DEFAULT
    fontWeight: 'bold',
    marginLeft: 5,
  },
  saveBtn: {
    backgroundColor: '#FF7F00', // primary.DEFAULT
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFFFFF', // surface.DEFAULT
    fontWeight: 'bold',
    fontSize: 16,
  },
});