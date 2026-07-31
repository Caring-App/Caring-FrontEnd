import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useTermsAgreement, TERM_LIST } from './useTermsAgreement';
import { styles } from './TermsAgreement.styles';
import LogoIcon from '@assets/icons/header/caring_logo.svg';

export default function TermsAgreementScreen({ navigation }: any) {
  const { checkedItems, isAllChecked, isRequiredChecked, handleCheckItem, handleCheckAll } = useTermsAgreement();

  const handleNextPress = () => {
    if (isRequiredChecked) {
      navigation.navigate('Signup');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 상단 로고 */}
        <View style={styles.logoContainer}>
          <LogoIcon width={50} height={50} />
        </View>

        {/* 상단 타이틀 */}
        <Text style={styles.title}>약관 동의</Text>
        <Text style={styles.subtitle}>서비스 이용을 위해 약관에 동의해 주세요.</Text>

        {/* 전체 동의 박스 */}
        <TouchableOpacity style={styles.allAgreeBox} onPress={handleCheckAll} activeOpacity={0.8}>
          <View style={[styles.checkbox, isAllChecked && styles.checkedBox]}>
            {isAllChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.allAgreeText}>전체 동의</Text>
        </TouchableOpacity>

        {/* 필수 약관 타이틀 */}
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666', marginTop: 16, marginBottom: 8, paddingHorizontal: 4 }}>필수 약관</Text>

        {/* 필수 약관 목록 */}
        {TERM_LIST.filter(term => term.required).map(term => (
          <TouchableOpacity
            key={term.id}
            style={styles.termItem}
            onPress={() => handleCheckItem(term.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, checkedItems[term.id] && styles.checkedBox]}>
              {checkedItems[term.id] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termText}>
              {term.title} <Text style={{ color: '#FF7F00' }}>(필수)</Text>
            </Text>
          </TouchableOpacity>
        ))}

        {/* 선택 약관 타이틀 */}
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666', marginTop: 20, marginBottom: 8, paddingHorizontal: 4 }}>선택 약관</Text>

        {/* 선택 약관 목록 */}
        {TERM_LIST.filter(term => !term.required).map(term => (
          <TouchableOpacity
            key={term.id}
            style={styles.termItem}
            onPress={() => handleCheckItem(term.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, checkedItems[term.id] && styles.checkedBox]}>
              {checkedItems[term.id] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termText}>{term.title}</Text>
          </TouchableOpacity>
        ))}

        {/* 다음 버튼 */}
        <TouchableOpacity
          style={[styles.nextButton, !isRequiredChecked && styles.disabledButton]}
          onPress={handleNextPress}
          disabled={!isRequiredChecked}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}