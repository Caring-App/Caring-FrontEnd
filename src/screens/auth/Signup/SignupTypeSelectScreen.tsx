import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useSignupTypeSelect } from '@features/auth/model';
import { CaringLogo, CaringDogIcon } from '@features/auth/ui';

export const SignupTypeSelectScreen = () => {
  const navigation = useNavigation();
  const { handleRoleSelect } = useSignupTypeSelect(navigation);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 상단 케어링 로고 */}
      <View style={[styles.logoWrapper, { marginTop: 50 }]}>
        <CaringLogo width={50} height={50} />
      </View>

      {/* 2. 중앙 컨텐츠 영역 (강아지 + 텍스트 + 버튼) */}
      <View style={styles.contentContainer}>
        {/* 강아지 캐릭터 */}
        <View style={styles.characterContainer}>
          <CaringDogIcon width={600} height={600} />
        </View>

        {/* 메인 안내 문구 (강아지 발 바로 아래) */}
        <Text style={styles.title}>안녕하세요!</Text>
        <Text style={styles.subtitle}>
          어떤 서비스를 이용하시나요?
        </Text>

        {/* 3. 역할 선택 버튼 영역 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.typeButton}
            onPress={() => handleRoleSelect('PROTECTOR')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>보호자</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.typeButton}
            onPress={() => handleRoleSelect('WARD')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>돌봄대상자</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupTypeSelectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoWrapper: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 24,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingHorizontal: 24,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -70,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'center',
    marginTop: -100,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
    paddingHorizontal: 8,
  },
  typeButton: {
    flex: 1,
    height: 58,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF7F00',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111111',
  },
});
