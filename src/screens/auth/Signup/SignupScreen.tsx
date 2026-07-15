import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';

export default function SignupScreen() {
  // 입력값 상태 관리
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); // 인증번호 상태 추가
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* 상단 타이틀 영역 */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>회원가입</Text>
          <Text style={styles.headerSubtitle}>케어링의 회원이 되어 서비스를 이용해보세요.</Text>
        </View>

        {/* 입력 폼 영역 */}
        <View style={styles.formContainer}>
          {/* 이름 */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              placeholder="이름을 입력하세요"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
          </View>

          {/* 전화번호 */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>전화번호</Text>
            <View style={styles.rowInputContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="전화번호 입력 (- 제외)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.rowButton}>
                <Text style={styles.rowButtonText}>인증요청</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 인증번호 입력란  */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>인증번호</Text>
            <View style={styles.rowInputContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="인증번호 6자리를 입력하세요"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.rowButton}>
                <Text style={styles.rowButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 비밀번호 */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>

          {/* 비밀번호 확인 */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 다시 한번 입력하세요"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* 가입하기 버튼 */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>가입하기</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  formContainer: {
    marginBottom: 40,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    fontSize: 15,
    color: '#333333',
  },
  rowInputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rowButton: {
    width: 90,
    height: 50,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  rowButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#FF7F00',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
