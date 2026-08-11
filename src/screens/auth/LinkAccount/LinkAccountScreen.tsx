import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import useLinkAccount from './hooks/useLinkAccount';
import { linkAccountStyles as styles } from './styles/linkAccount.styles';

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
