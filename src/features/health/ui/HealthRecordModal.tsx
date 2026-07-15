import React from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { HealthStyles as styles } from '../styles/HealthStyles';
import { useHealthRecord } from '../hooks/useHealthRecord';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const HealthRecordModal = ({ visible, onClose, onSave }: Props) => {
  const { data, updateField, reset } = useHealthRecord();

  const handleSave = () => {
    onSave(data);
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>오늘의 건강 기록하기</Text>
          <Text style={styles.subtitle}>입력하신 수치는 보호자님 리포트에 반영됩니다.</Text>
          
          <TextInput style={styles.input} placeholder="당뇨 수치 입력" value={data.bloodSugar} onChangeText={(v) => updateField('bloodSugar', v)} />
          <TextInput style={styles.input} placeholder="혈압 수치 입력" value={data.bloodPressure} onChangeText={(v) => updateField('bloodPressure', v)} />
          <TextInput style={styles.input} placeholder="체중 입력" value={data.weight} onChangeText={(v) => updateField('weight', v)} />
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};