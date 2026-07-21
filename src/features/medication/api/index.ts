import axios from 'axios'; // 또는 프로젝트 내 설정된 커스텀 axios 인스턴스 경로

// 복약 상태 변경 데이터를 서버로 전송하는 API 함수
export const updateMedicationStatus = async (slot: string, taken: boolean) => {
  try {
    // Spring Boot 백엔드 서버의 복약 상태 업데이트 엔드포인트 예시
    const response = await axios.post('/api/medication/status', {
      slot, // 'morning' | 'lunch' | 'dinner'
      taken, // true | false
    });
    return response.data;
  } catch (error) {
    console.error('복약 상태 서버 전송 실패:', error);
    throw error;
  }
};