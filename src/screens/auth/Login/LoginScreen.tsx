import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.spacer} />

      <Text style={styles.subTitle}>돌봄의 시작, 케어링</Text>
      <Text style={styles.mainTitle}>Caring</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디를 입력하세요."
          value={id}
          onChangeText={setId}
          placeholderTextColor="#999"
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.findMenuContainer}>
        <TouchableOpacity><Text style={styles.findMenuText}>아이디 찾기</Text></TouchableOpacity>
        <Text style={styles.divider}>|</Text>
        <TouchableOpacity><Text style={styles.findMenuText}>비밀번호 찾기</Text></TouchableOpacity>
        <Text style={styles.divider}>|</Text>
        <TouchableOpacity><Text style={styles.findMenuText}>회원가입</Text></TouchableOpacity>
      </View>

      <View style={styles.socialContainer}>
        <Text style={styles.socialTitle}>간편 로그인</Text>
        <View style={styles.socialButtonsRow}>
          <View style={[styles.circleButton, { backgroundColor: '#FEE500' }]} />
          <View style={[styles.circleButton, { backgroundColor: '#EAEAEA' }]} />
          <View style={[styles.circleButton, { backgroundColor: '#03C75A' }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  spacer: {
    flex: 0.5,
  },
  subTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FF7F00',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF7F00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  findMenuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  findMenuText: {
    fontSize: 12,
    color: '#666666',
  },
  divider: {
    marginHorizontal: 10,
    color: '#CCCCCC',
    fontSize: 12,
  },
  socialContainer: {
    width: '100%',
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 15,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});
