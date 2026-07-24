import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTermsAgreement, TERM_LIST } from './useTermsAgreement';
import { styles } from './TermsAgreement.styles';
import { CaringLogo } from './CaringLogo';

export default function TermsAgreementScreen({ navigation }: any) {
  const { checkedItems, isAllChecked, isRequiredChecked, handleCheckItem, handleCheckAll } = useTermsAgreement();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <CaringLogo />
      </View>
      
      <Text style={styles.title}>서비스 이용을 위해{'\n'}약관에 동의해 주세요.</Text>

      {/* 전체 동의 버튼 (스타일 이름을 allAgreeBox로 수정) */}
      <TouchableOpacity style={styles.allAgreeBox} onPress={handleCheckAll}>
        <Text style={styles.allAgreeText}>모든 약관에 동의합니다.</Text>
      </TouchableOpacity>

      {/* 개별 약관 목록 */}
      {TERM_LIST.map(term => (
        <TouchableOpacity
          key={term.id}
          style={styles.termItem}
          onPress={() => handleCheckItem(term.id)}
        >
          <Text style={styles.termText}>
            {term.required ? '[필수]' : '[선택]'} {term.title} {checkedItems[term.id] ? '✓' : ''}
          </Text>
        </TouchableOpacity>
      ))}

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: isRequiredChecked ? '#FF7E00' : '#DDDDDD' }]}
        disabled={!isRequiredChecked}
        onPress={() => {
          navigation.navigate('Signup');
        }}
      >
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}