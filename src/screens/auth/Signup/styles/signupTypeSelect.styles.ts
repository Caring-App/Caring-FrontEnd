import { StyleSheet } from 'react-native';

export const signupTypeSelectStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 30,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  selectButton: {
    flex: 1,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#FF7F00',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF7F00',
  },
});