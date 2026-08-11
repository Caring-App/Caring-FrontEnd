import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTermsAgreement, TERM_LIST, WARD_TERM_LIST } from '@features/auth/model';
import { CheckIcon } from '@features/auth/ui';
import { CaringLogo } from '@shared/ui/AppHeader/CaringLogo';
import ChevronRight from '@assets/icons/report/chevron-right.svg';

function TermCheckbox({ checked }: { checked: boolean }) {
  return (
    <View
      className={`h-5 w-5 items-center justify-center rounded border-[1.6px] bg-surface ${
        checked ? 'border-primary' : 'border-border-checkbox'
      }`}
    >
      {checked && <CheckIcon size={12} />}
    </View>
  );
}

export default function TermsAgreementScreen({ navigation, route }: any) {
  const role = route?.params?.role;
  const termList = role === 'WARD' ? WARD_TERM_LIST : TERM_LIST;
  const { checkedItems, isAllChecked, isRequiredChecked, handleCheckItem, handleCheckAll } = useTermsAgreement(termList);

  const handleNextPress = () => {
    if (isRequiredChecked) {
      navigation.navigate(role === 'WARD' ? 'WardSignup' : 'Signup');
    }
  };

  const requiredTerms = termList.filter(term => term.required);
  const optionalTerms = termList.filter(term => !term.required);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        {/* 상단 헤더 */}
        <View className="relative flex-row items-center justify-center py-4">
          <View className="absolute left-0">
            <CaringLogo size={44} />
          </View>
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
          <TermCheckbox checked={isAllChecked} />
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
                <TermCheckbox checked={!!checkedItems[term.id]} />
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
                <TermCheckbox checked={!!checkedItems[term.id]} />
                <Text className="font-pretendard-medium text-base text-text-primary">{term.title}</Text>
              </View>
              <ChevronRight width={16} height={16} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 다음 버튼 (하단 고정) */}
      <View className="bg-surface px-6 pb-10 pt-2">
        <TouchableOpacity
          className={`h-[52px] items-center justify-center rounded-card ${
            isRequiredChecked ? 'bg-primary' : 'bg-border-link'
          }`}
          onPress={handleNextPress}
          disabled={!isRequiredChecked}
          activeOpacity={0.8}
        >
          <Text className="font-pretendard-semibold text-lg text-white">다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
