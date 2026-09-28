import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import CheckSmallWhiteIcon from '@assets/icons/auth/check-small-white.svg';
import { DISEASE_LIST } from '../model/diseaseList';

interface DiseaseSelectorProps {
  selectedDiseases: string[];
  onToggle: (disease: string) => void;
}

// 기저 질환 다중 선택 카드 그리드 (Figma 970:7802) — 3열, 카드 간격 12
// 선택 상태는 시안에 없어서 브랜드 주황 테두리 + 채운 체크박스로 표시
export function DiseaseSelector({ selectedDiseases, onToggle }: DiseaseSelectorProps) {
  return (
    <View className="-mx-1.5 flex-row flex-wrap">
      {DISEASE_LIST.map(disease => {
        const selected = selectedDiseases.includes(disease);
        return (
          <View key={disease} className="w-1/3 p-1.5">
            <TouchableOpacity
              className={`min-h-[50px] flex-row items-center gap-2 rounded-card border-[0.8px] px-3 py-3.5 ${
                selected ? 'border-primary bg-surface-signupSelected' : 'border-border-signupCard bg-surface'
              }`}
              onPress={() => onToggle(disease)}
              activeOpacity={0.7}
            >
              <View
                className={`h-5 w-5 items-center justify-center rounded border-[0.8px] ${
                  selected ? 'border-primary bg-primary' : 'border-border-signupCheckbox bg-surface'
                }`}
              >
                {selected && <CheckSmallWhiteIcon width={12} height={9} />}
              </View>
              <Text className="shrink text-center font-pretendard-medium text-sm leading-[16.25px] text-text-diseaseItem">
                {disease}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}
