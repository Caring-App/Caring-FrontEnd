import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

export default function LinkScreen() {
  const [linkCode, setLinkCode] = useState('');

  return (
    <View style={styles.container}>
      {/* 상단 로고 이미지 (60dp 크기 매칭) */}
      <Image 
        source={require('../../assets/logo.png')} // 본인 프로젝트의 로고 이미지 경로로 수정하세요!
        style={styles.logo}
        resizeMode="contain"
      />

      {/* 안내 텍스트 */}
      <Text style={styles.title}>Caring은</Text>
      <Text style={styles.description}>
        개인의 고유 코드를 사용하여{"\n"}보호자와의{"\n"}간편한 연동을 제공합니다.
      </Text>

      {/* 연동 코드 입력 카드 박스 */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderIcon}>🔑</Text>
          <Text style={styles.cardHeaderTitle}>연동 코드 입력</Text>
        </View>
        <Text style={styles.cardSubText}>보호자 앱에서 확인한 연동 코드를 적어주세요.</Text>

        <Text style={styles.inputLabel}>연동 코드</Text>
        <TextInput
          style={styles.input}
          value={linkCode}
          onChangeText={setLinkCode}
          placeholder="코드를 입력하세요"
          placeholderTextColor="#CCCCCC"
          textAlign="center" // 글자 가운데 정렬
        />
      </View>

      {/* 하단 안내 문구 */}
      <Text style={styles.footerText}>
        연동을 진행할{"\n"}보호자의 연동 코드를{"\n"}입력해주세요!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 60,
  },
  logo: {
    width: 60,
    height: 60,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24, // XML의 lineSpacingExtra="6dp" 반영
    marginTop: 10,
    marginBottom: 40,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    // 그림자 효과 (XML의 카드 레이아웃 느낌)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // 안드로이드용 그림자
    marginBottom: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardHeaderIcon: {
    marginRight: 6,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF7F00', // 오렌지 테마 적용
  },
  cardSubText: {
    fontSize: 11,
    color: '#999999',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FAFAFA',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
});