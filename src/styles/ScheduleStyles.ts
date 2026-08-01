import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff', padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 25 },
  titleGroup: { flexDirection: 'row', alignItems: 'center' },
  iconCalendar: { width: 16, height: 16, backgroundColor: '#FD7E14', borderRadius: 3, marginRight: 8 },
  textTitle: { color: '#111111', fontSize: 19, fontWeight: 'bold' },
  label: { color: '#212529', fontSize: 15, fontWeight: 'bold', marginBottom: 8, marginTop: 12 },
  input: { height: 48, borderWidth: 1, borderColor: '#ced4da', borderRadius: 6, paddingHorizontal: 12, fontSize: 14, color: '#212529', marginBottom: 20 },
  pickerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 16, paddingHorizontal: 15, height: 150, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 5, elevation: 2 },
  wheel: { flex: 1, height: 130, backgroundColor: 'transparent' },
  colon: { fontSize: 18, fontWeight: 'bold', color: '#212529', textAlign: 'center', width: 10 },
  voiceSettingContainer: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 16, padding: 16, marginBottom: 25 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#ced4da', marginRight: 10 },
  radioChecked: { borderColor: '#FD7E14', backgroundColor: '#FD7E14' },
  radioText: { fontSize: 14, color: '#404446', fontWeight: '500' },
  voiceButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  voiceBtn: { flex: 1, height: 40, borderWidth: 1, borderColor: '#FD7E14', borderRadius: 8, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
  voiceBtnText: { color: '#FD7E14', fontSize: 13, fontWeight: 'bold' },
  btnSave: { height: 54, backgroundColor: '#FD7E14', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  btnSaveText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});