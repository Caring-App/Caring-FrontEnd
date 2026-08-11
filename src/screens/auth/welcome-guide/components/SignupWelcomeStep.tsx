import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Clipboard } from 'react-native';
import { CaringLogo } from './CaringLogo';
import { CaringDogIcon } from './CaringDogIcon';
import { RssIcon } from './RssIcon';
import { styles } from '../styles/SignupWelcomeStep.styles';

interface Props {
  navigation: any;
  userName?: string;
  currentStep?: any;
  onNext?: () => void;
  onClose?: () => void;
}

export const SignupWelcomeStep = ({ navigation, userName = '---', currentStep, onNext, onClose }: Props) => {
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