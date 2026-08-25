import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DISEASE_LIST } from '../model/diseaseList';

interface DiseaseSelectorProps {
  selectedDiseases: string[];
  onToggle: (disease: string) => void;
}

// 기저 질환 다중 선택 UI — WardSignupScreen / SocialAdditionalInfoScreen(WARD) 공용
export function DiseaseSelector({ selectedDiseases, onToggle }: DiseaseSelectorProps) {
  return (
    <View className="mb-4">
      <Text className="mb-3 font-pretendard-semibold text-lg text-text-body">기저 질환 선택</Text>
      <View className="flex-row flex-wrap gap-y-3.5">
        {DISEASE_LIST.map(disease => {
          const selected = selectedDiseases.includes(disease);
          return (
            <TouchableOpacity
              key={disease}
              className="w-1/3 flex-row items-center gap-1.5 pr-2"
              onPress={() => onToggle(disease)}
              activeOpacity={0.7}
            >
              <View
                className={`h-[13px] w-[13px] rounded-sm border ${
                  selected ? 'border-primary bg-primary' : 'border-border-input bg-surface'
                }`}
              />
              <Text className="font-pretendard-semibold text-sm text-text-body">{disease}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
