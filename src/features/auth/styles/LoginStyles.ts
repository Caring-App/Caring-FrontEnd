import { StyleSheet } from 'react-native';

export const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  loginButton: {
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  devRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  devButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  devButtonText: {
    color: 'red',
    fontSize: 14,
    fontWeight: 'bold',
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
});