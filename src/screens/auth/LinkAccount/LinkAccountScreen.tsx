import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import { useLinkAccount } from '@features/auth/model';

export default function LinkAccountScreen() {
  const { code, setCode, handlePaste, handleSubmit, isValidCode } = useLinkAccount();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 상단 로고 */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Caring</Text>
        </View>

        {/* 안내 타이틀 */}
        <Text style={styles.mainTitle}>
          Caring은{'\n'}
          개인의 고유 코드를 사용하여{'\n'}
          보호자와의{'\n'}
          간편한 연동을 제공합니다
        </Text>

        {/* 연동 코드 입력 카드리스트 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📶</Text>
            <Text style={styles.cardTitle}>연동 코드 입력</Text>
          </View>
          <Text style={styles.cardSubText}>
            보호자 마이페이지 {'>'} 연동 코드 확인 {'>'} 코드 복사
          </Text>

          <View style={styles.inputBox}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>연동 코드</Text>
              <TouchableOpacity
                style={styles.pasteBtn}
                onPress={handlePaste}
                activeOpacity={0.8}
              >
                <Text style={styles.pasteBtnText}>붙여넣기</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="연동 코드를 입력하세요"
              placeholderTextColor="#C7C7CC"
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* 하단 안내 및 다음 버튼 */}
        <Text style={styles.guideText}>
          연동을 진행할{'\n'}
          보호자의 연동 코드를{'\n'}
          입력해주세요!
        </Text>

        <TouchableOpacity
          style={[styles.submitBtn, !isValidCode && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!isValidCode}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
  },
  card: {
    width: '100%',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 32,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  cardSubText: {
    fontSize: 11,
    color: '#8E8E93',
    marginBottom: 16,
  },
  inputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  pasteBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  pasteBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333333',
  },
  guideText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#FF6B00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
