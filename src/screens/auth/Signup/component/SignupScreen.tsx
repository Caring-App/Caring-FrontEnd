import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';


import BirthDatePicker from './BirthDatePicker';
import useSignUp from '../hooks/useSignUp';
import { signupStyles as styles } from '../styles/signup.styles';

// 기저 질환 옵션 목록
const DISEASE_OPTIONS = [
  '고혈압', '당뇨병', '치매',
  '골다공증', '고지혈증', '관절염',
  '심혈관 질환', '만성 신부전', '파킨슨병',
  '기타',
];

export default function SignupScreen() {
  // Custom Hook에서 상태와 핸들러 로드
  const {
    form,
    setName,
    setPhone,
    setAuthCode,
    setPassword,
    setPasswordConfirm,
    setBirthDate,
    setAddress,
    toggleDisease,
  } = useSignUp();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.subtitle}>케어링의 회원이 되어 서비스를 이용해보세요.</Text>

        {/* 1. 이름 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력하세요"
            value={form.name}
            onChangeText={setName}
          />
        </View>

        {/* 2. 전화번호 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>전화번호</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.flexInput]}
              placeholder="전화번호 입력 (- 제외)"
              keyboardType="numeric"
              value={form.phone}
              onChangeText={setPhone}
            />
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>인증요청</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. 인증번호 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>인증번호</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.flexInput]}
              placeholder="인증번호 6자리를 입력하세요"
              keyboardType="numeric"
              value={form.authCode}
              onChangeText={setAuthCode}
            />
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. 비밀번호 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력하세요"
            secureTextEntry
            value={form.password}
            onChangeText={setPassword}
          />
        </View>

        {/* 5. 비밀번호 확인 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 다시 한번 입력하세요"
            secureTextEntry
            value={form.passwordConfirm}
            onChangeText={setPasswordConfirm}
          />
        </View>

        {/* 6. 생년월일 (달력 UI) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>생년월일</Text>
          <BirthDatePicker
            value={form.birthDate}
            onChange={(day: any) => setBirthDate(day.dateString)}
          />
        </View>

        {/* 7. 주소 입력 (직접 입력 방식 - 패키지 설치 없음) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>주소</Text>
          <TextInput
            style={[styles.input, { marginBottom: 8 }]}
            placeholder="기본 주소 (예: 서울특별시 마포구 ...)"
            value={form.address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="상세 주소를 입력하세요 (동, 호수 등)"
          />
        </View>

        {/* 8. 기저 질환 선택 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>기저 질환 선택</Text>
          <View style={styles.checkboxContainer}>
            {DISEASE_OPTIONS.map((item) => {
              const isSelected = form.selectedDiseases.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={styles.checkboxRow}
                  onPress={() => toggleDisease(item)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 가입하기 버튼 */}
        <TouchableOpacity style={styles.submitButton} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>가입하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}