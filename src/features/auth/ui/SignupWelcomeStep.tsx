import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { CaringLogo } from './CaringLogo';
import { CaringDogIcon } from './CaringDogIcon';
import { RssIcon } from './RssIcon';

interface Props {
  navigation: any;
  userName?: string;
  currentStep?: any;
  onNext?: () => void;
  onClose?: () => void;
}

export const SignupWelcomeStep = ({ userName = '---', currentStep, onNext }: Props) => {
  const userCode = 'ABC123-DFG456';

  const handleCopyCode = () => {
    Clipboard.setString(userCode);
    Alert.alert('복사 완료', '연동 코드가 복사되었습니다.');
  };

  const step = currentStep as any;

  if (!step) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CaringLogo />
      </View>

      <View style={styles.contentContainer}>
        {step.type === 'character' && (
          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 200 }}>
            <View style={styles.characterContainer}>
              <CaringDogIcon width={600} height={600} />
            </View>
            {step.title && (
              <View style={[styles.textContainer, { marginTop: -80 }]}>
                <Text style={[styles.title, { textAlign: 'center' }]}>{step.title}</Text>
              </View>
            )}
          </View>
        )}

        {step.type === 'code' && (
          <View style={[styles.codeViewContainer, { justifyContent: 'center', marginTop: -20, paddingHorizontal: 20 }]}>
            {/* 상단 타이틀 */}
            <Text style={[styles.title, { fontSize: 25, lineHeight: 26, marginBottom: 16, textAlign: 'center', fontWeight: 'bold', color: '#1E1E1E' }]}>
              {step.title}
            </Text>

            {/* 연동 코드 카드 박스 */}
            <View style={styles.codeCard}>
              <View style={styles.codeCardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <RssIcon width={18} height={18} color="#FF9500" style={{ marginRight: 6 }} />
                  <Text style={[styles.codeCardTitle, { color: '#1E1E1E', fontSize: 18, fontWeight: 'bold', marginBottom: 0 }]}>
                    {userName}님 고유 연동 코드
                  </Text>
                </View>

                <Text style={[styles.codeCardSubText, { fontSize: 9, color: '#8E8E93' }]}>
                  돌봄 대상자의 안전한 연결을 위해 아래 코드를 복사하여 전달해 주세요.
                </Text>
              </View>

              <View style={styles.codeBoxWrapper}>
                <View style={styles.codeBoxLabelRow}>
                  <Text style={styles.codeBoxLabel}>연동 코드</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
                    <Text style={styles.copyButtonText}>복사</Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.codeTextInputBox}
                  value={userCode}
                  editable={false}
                  selectTextOnFocus={true}
                />
              </View>
            </View>

            {/* 하단 설명 문구 */}
            {!!step.description && (
              <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#4A4A4A', textAlign: 'center', lineHeight: 22, fontWeight: '600' }}>
                  {step.description}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={onNext} activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  closeButton: {
    padding: 10,
  },
  closeText: {
    fontSize: 20,
    color: '#000000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    lineHeight: 30,
  },
  codeViewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  codeCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  codeCardHeader: {
    marginBottom: 20,
  },
  codeCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 8,
  },
  codeCardSubText: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 16,
  },
  codeBoxWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  codeBoxLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeBoxLabel: {
    fontSize: 12,
    color: '#8E8E93',
  },
  copyButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  codeTextInputBox: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E1E1E',
    letterSpacing: 1,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#FF9500',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});