import { StyleSheet } from 'react-native';

export const HealthStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 20, backgroundColor: 'white', borderRadius: 15 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 12, color: '#666', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15 },
  saveButton: { backgroundColor: '#FF8C00', padding: 15, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});