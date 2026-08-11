import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';

import useSignUp from '@features/auth/model/useSignUp';
import { BirthDatePicker } from '@features/auth/ui';

// 로고 SVG import
import LogoIcon from '@assets/icons/header/caring_logo.svg';

export const SignupScreen = () => {
  const signUpHook = useSignUp() as any;

  // 훅 상태 및 핸들러 추출
  const form = signUpHook?.form || {};
  const setName = signUpHook?.setName || signUpHook?.handleNameChange;
  const setPhone = signUpHook?.setPhone || signUpHook?.handlePhoneChange;
  const setAuthCode = signUpHook?.setAuthCode || signUpHook?.handleAuthCodeChange;
  const setPassword = signUpHook?.setPassword || signUpHook?.handlePasswordChange;
  const setConfirmPassword = signUpHook?.setConfirmPassword || signUpHook?.handleConfirmPasswordChange;

  const handleSendAuthCode = signUpHook?.handleSendAuthCode || (() => {});
  const handleVerifyAuthCode = signUpHook?.handleVerifyAuthCode || (() => {});

  const setDetailAddress = signUpHook?.setDetailAddress;
  const handleSelectAddress = signUpHook?.handleSelectAddress;
  const handleBirthDateChange = signUpHook?.setBirthDate || signUpHook?.handleBirthDateChange;

  const toggleDisease = signUpHook?.toggleDisease || signUpHook?.handleToggleDisease || (() => {});
  const handleSubmit = signUpHook?.handleSubmit || signUpHook?.handleSignUp || signUpHook?.onSubmit || (() => {});
  const isFormValid = signUpHook?.isFormValid ?? true;

  // 기저질환 목록
  const diseaseList: string[] = signUpHook?.diseaseList || signUpHook?.diseases || [
    '고혈압',
    '당뇨병',
    '치매',
    '골다공증',
    '고지혈증',
    '관절염',
    '심혈관 질환',
    '만성 신부전',
    '파킨슨병',
    '기타',
  ];

  const selectedDiseases: string[] = form?.selectedDiseases || signUpHook?.selectedDiseases || [];

  return (
    <SafeAreaView style={signupStyles.container}>
      <ScrollView contentContainerStyle={signupStyles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 상단 헤더 영역: 로고와 타이틀을 독립된 구조로 분리 */}
        <View style={signupStyles.headerContainer}>
          <View style={signupStyles.logoWrapper}>
            <LogoIcon width={44} height={44} />
          </View>
          <Text style={signupStyles.title}>회원가입</Text>
        </View>

        {/* 1. 이름 입력 */}
        {form?.name !== undefined && (
          <View style={signupStyles.inputGroup}>
            <Text style={signupStyles.label}>이름</Text>
            <TextInput
              style={signupStyles.input}
              placeholder="이름을 입력해 주세요"
              placeholderTextColor="#A1A1AA"
              value={form.name}
              onChangeText={setName}
            />
          </View>
        )}

        {/* 2. 전화번호 입력 & 인증번호 요청 */}
        {form?.phone !== undefined && (
          <View style={signupStyles.inputGroup}>
            <Text style={signupStyles.label}>전화번호</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[signupStyles.input, { flex: 1 }]}
                placeholder="전화번호를 입력해 주세요 (- 제외)"
                placeholderTextColor="#A1A1AA"
                keyboardType="number-pad"
                value={form.phone}
                onChangeText={setPhone}
              />
              <TouchableOpacity
                style={[signupStyles.submitButton, { width: 90, height: 48, marginTop: 0 }]}
                onPress={handleSendAuthCode}
              >
                <Text style={signupStyles.submitButtonText}>인증요청</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 3. 인증번호 입력 & 확인 */}
        <View style={signupStyles.inputGroup}>
          <Text style={signupStyles.label}>인증번호</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              style={[signupStyles.input, { flex: 1 }]}
              placeholder="인증번호 6자리를 입력해 주세요"
              placeholderTextColor="#A1A1AA"
              keyboardType="number-pad"
              value={form?.authCode || ''}
              onChangeText={setAuthCode}
            />
            <TouchableOpacity
              style={[signupStyles.submitButton, { width: 90, height: 48, marginTop: 0 }]}
              onPress={handleVerifyAuthCode}
            >
              <Text style={signupStyles.submitButtonText}>인증확인</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. 비밀번호 입력 */}
        <View style={signupStyles.inputGroup}>
          <Text style={signupStyles.label}>비밀번호</Text>
          <TextInput
            style={signupStyles.input}
            placeholder="비밀번호를 입력해 주세요"
            placeholderTextColor="#A1A1AA"
            secureTextEntry={true}
            value={form?.password || ''}
            onChangeText={setPassword}
          />
        </View>

        {/* 5. 비밀번호 확인 입력 */}
        <View style={signupStyles.inputGroup}>
          <Text style={signupStyles.label}>비밀번호 확인</Text>
          <TextInput
            style={signupStyles.input}
            placeholder="비밀번호를 다시 입력해 주세요"
            placeholderTextColor="#A1A1AA"
            secureTextEntry={true}
            value={form?.confirmPassword || ''}
            onChangeText={setConfirmPassword}
          />
          {form?.password && form?.confirmPassword && form.password !== form.confirmPassword && (
            <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>
              비밀번호가 일치하지 않습니다.
            </Text>
          )}
        </View>

        {/* 6. 생년월일 선택 */}
        <View style={signupStyles.inputGroup}>
          <Text style={signupStyles.label}>생년월일</Text>
          <BirthDatePicker
            value={form?.birthDate || ''}
            onChange={(date: string) => {
              if (handleBirthDateChange) {
                handleBirthDateChange(date);
              }
            }}
          />
        </View>

        {/* 7. 주소 입력 */}
        <View style={signupStyles.inputGroup}>
          <Text style={signupStyles.label}>주소</Text>
          <TouchableOpacity onPress={handleSelectAddress} activeOpacity={0.8}>
            <TextInput
              style={[signupStyles.input, { marginBottom: 8 }]}
              placeholder="기본 주소 (예: 서울특별시 마포구 ...)"
              placeholderTextColor="#A1A1AA"
              value={form?.address}
              editable={false}
              pointerEvents="none"
            />
          </TouchableOpacity>
          <TextInput
            style={signupStyles.input}
            placeholder="상세 주소를 입력하세요 (동, 호수 등)"
            placeholderTextColor="#A1A1AA"
            value={form?.detailAddress}
            onChangeText={setDetailAddress}
          />
        </View>

        {/* 8. 기저 질환 선택 */}
        <View style={signupStyles.inputGroup}>
          <Text style={signupStyles.label}>기저 질환 선택</Text>

          <View style={signupStyles.diseaseGrid}>
            {diseaseList.map((disease: string) => {
              const isSelected = selectedDiseases.includes(disease);
              return (
                <View key={disease} style={signupStyles.diseaseItem}>
                  <TouchableOpacity
                    style={signupStyles.checkboxRow}
                    onPress={() => toggleDisease(disease)}
                    activeOpacity={0.7}
                  >
                    <View style={[signupStyles.checkbox, isSelected && signupStyles.checkboxActive]}>
                      {isSelected && <Text style={signupStyles.checkmark}>✓</Text>}
                    </View>
                    <Text style={signupStyles.diseaseText}>{disease}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* 9. 제출 버튼 */}
        <TouchableOpacity
          style={[
            signupStyles.submitButton,
            !isFormValid && signupStyles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={signupStyles.submitButtonText}>가입하기</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const PRIMARY_COLOR = '#FF7F00';

const signupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 24 : 60,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 32,
    marginTop: 10,
  },
  logoWrapper: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    includeFontPadding: false,
    textAlign: 'left',
    lineHeight: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111',
    backgroundColor: '#FFF',
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  diseaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    rowGap: 14,
  },
  diseaseItem: {
    width: '33.33%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#CED4DA',
    borderRadius: 4,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  diseaseText: {
    fontSize: 13,
    color: '#333333',
  },
});
