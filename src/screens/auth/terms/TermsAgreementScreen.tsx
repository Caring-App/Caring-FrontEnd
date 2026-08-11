import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTermsAgreement, TERM_LIST } from '@features/auth/model';
import { CaringLogo } from '@features/auth/ui';
import ChevronRight from '@assets/icons/report/chevron-right.svg';

export default function TermsAgreementScreen({ navigation }: any) {
  const { checkedItems, isAllChecked, isRequiredChecked, handleCheckItem, handleCheckAll } = useTermsAgreement();

  const handleNextPress = () => {
    if (isRequiredChecked) {
      navigation.navigate('Signup');
    }
  };

  const requiredTerms = TERM_LIST.filter(term => term.required);
  const optionalTerms = TERM_LIST.filter(term => !term.required);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        {/* 상단 헤더 */}
        <View className="flex-row items-center gap-3 py-4">
          <CaringLogo width={44} height={44} />
          <Text className="font-pretendard-bold text-2xl text-text-primary">약관 동의</Text>
        </View>

        <Text className="mt-2 font-pretendard-medium text-base text-text-termsLabel">
          서비스 이용을 위해 약관에 동의해 주세요
        </Text>

        {/* 전체 동의 */}
        <TouchableOpacity
          className="mt-6 flex-row items-center gap-3 rounded-card bg-surface-termsRow px-4 py-4"
          onPress={handleCheckAll}
          activeOpacity={0.8}
        >
          <View
            className={`h-6 w-6 items-center justify-center rounded-lg border-[1.6px] ${
              isAllChecked ? 'border-primary' : 'border-border-checkbox'
            } bg-surface`}
          >
            {isAllChecked && <Text className="font-pretendard-bold text-sm text-text-primary">✓</Text>}
          </View>
          <Text className="font-pretendard-semibold text-lg text-text-primary">전체 동의</Text>
        </TouchableOpacity>

        {/* 필수 약관 */}
        <Text className="mb-3 mt-6 font-pretendard-medium text-base text-text-termsLabel">필수 약관</Text>
        <View className="gap-4">
          {requiredTerms.map(term => (
            <TouchableOpacity
              key={term.id}
              className="flex-row items-center justify-between"
              onPress={() => handleCheckItem(term.id)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={`h-5 w-5 items-center justify-center rounded border-[1.6px] ${
                    checkedItems[term.id] ? 'border-primary' : 'border-border-checkbox'
                  } bg-surface`}
                >
                  {checkedItems[term.id] && <Text className="text-[11px] text-text-primary">✓</Text>}
                </View>
                <Text className="font-pretendard-medium text-base text-text-primary">
                  {term.title} <Text className="text-text-termsRequired">(필수)</Text>
                </Text>
              </View>
              <ChevronRight width={16} height={16} />
            </TouchableOpacity>
          ))}
        </View>

        {/* 선택 약관 */}
        <Text className="mb-3 mt-6 font-pretendard-medium text-base text-text-termsLabel">선택 약관</Text>
        <View className="gap-4">
          {optionalTerms.map(term => (
            <TouchableOpacity
              key={term.id}
              className="flex-row items-center justify-between"
              onPress={() => handleCheckItem(term.id)}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className={`h-5 w-5 items-center justify-center rounded border-[1.6px] ${
                    checkedItems[term.id] ? 'border-primary' : 'border-border-checkbox'
                  } bg-surface`}
                >
                  {checkedItems[term.id] && <Text className="text-[11px] text-text-primary">✓</Text>}
                </View>
                <Text className="font-pretendard-medium text-base text-text-primary">{term.title}</Text>
              </View>
              <ChevronRight width={16} height={16} />
            </TouchableOpacity>
          ))}
        </View>

        {/* 다음 버튼 */}
        <TouchableOpacity
          className={`mt-10 h-[52px] items-center justify-center rounded-card ${
            isRequiredChecked ? 'bg-primary' : 'bg-border-link'
          }`}
          onPress={handleNextPress}
          disabled={!isRequiredChecked}
          activeOpacity={0.8}
        >
          <Text className="font-pretendard-semibold text-lg text-white">다음</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
