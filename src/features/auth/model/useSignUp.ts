import { useState } from 'react';

export default function useSignUp() {
  // 입력 폼 상태 관리
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);

  // 주소 모달 상태
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // 기저 질환 체크박스 토글 함수
  const toggleDisease = (disease: string) => {
    if (selectedDiseases.includes(disease)) {
      setSelectedDiseases(selectedDiseases.filter((item) => item !== disease));
    } else {
      setSelectedDiseases([...selectedDiseases, disease]);
    }
  };

  // 다음 주소 검색 선택 핸들러
  const handleSelectAddress = (data: any) => {
    setAddress(data.address);
    setIsAddressModalOpen(false);
  };

  return {
    // 상태값 모음
    form: {
      name,
      phone,
      authCode,
      password,
      passwordConfirm,
      birthDate,
      address,
      selectedDiseases,
    },
    // Setters
    setName,
    setPhone,
    setAuthCode,
    setPassword,
    setPasswordConfirm,
    setBirthDate,
    setAddress,
    // 모달 및 핸들러
    isAddressModalOpen,
    setIsAddressModalOpen,
    toggleDisease,
    handleSelectAddress,
  };
}
