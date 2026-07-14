import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  pillButton: { width: '30%', paddingVertical: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1 },
  btnDone: { backgroundColor: '#FF7A00', borderColor: '#FF7A00' },
  btnPending: { backgroundColor: '#F5F5F5', borderColor: '#DDD' },
  nameText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  statusText: { fontSize: 12, marginTop: 5, color: '#333' },
});