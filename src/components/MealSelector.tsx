import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/MedicationStyles';

interface Props {
  selectedMeal: string;
  onSelect: (meal: string) => void;
}

export const MealSelector = ({ selectedMeal, onSelect }: Props) => {
  const mealOptions = ['아침', '점심', '저녁'];
  return (
    <View style={styles.mealButtonGroup}>
      {mealOptions.map((meal) => (
        <TouchableOpacity
          key={meal}
          style={[styles.mealBtn, selectedMeal === meal && styles.mealBtnActive]}
          onPress={() => onSelect(meal)}
        >
          <Text style={[styles.mealBtnText, selectedMeal === meal && styles.mealBtnTextActive]}>
            {meal}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};