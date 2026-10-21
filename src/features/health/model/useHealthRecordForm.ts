import { useEffect, useState } from 'react';
import { getApiErrorMessage, logApiError } from '@shared/api';
import { recordHealthApi } from '../api/healthRecordApi';
import { HEALTH_RECORD_DISEASES } from './healthRecordDiseases';
import { HealthRecordKind } from './reportTypes';

const DEFAULT_ERROR_MESSAGE = '저장하지 못했어요. 잠시 후 다시 시도해 주세요.';

const toDigits = (value: string) => value.replace(/\D/g, '').slice(0, 3);

// "오늘의 건강 기록하기" 모달의 입력 상태 — 혈당, 수축기 혈압(위 숫자)을 서버에 기록(POST /api/health-record).
// 백엔드는 기저질환별 숫자 하나만 받아서(당뇨병=혈당, 고혈압=혈압) 체중·이완기 혈압은 받지 않음.
// 기록은 하루 여러 번 가능하고(매번 새로 저장) 보호자 그래프에는 그날 마지막 값이 쓰여서, 열 때마다 빈 칸으로 시작함
export function useHealthRecordForm(visible: boolean) {
  const [values, setValues] = useState<Record<HealthRecordKind, string>>({ bloodSugar: '', bloodPressure: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!visible) return;
    setValues({ bloodSugar: '', bloodPressure: '' });
    setErrorMessage('');
  }, [visible]);

  const setValue = (kind: HealthRecordKind, value: string) =>
    setValues(prev => ({ ...prev, [kind]: toDigits(value) }));

  const handleSave = async (onSaved: () => void) => {
    if (isSubmitting) return;
    const filled = (Object.keys(values) as HealthRecordKind[]).filter(kind => Number(values[kind]) > 0);
    if (filled.length === 0) {
      setErrorMessage('혈당이나 혈압 중 하나 이상 입력해 주세요.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const results = await Promise.allSettled(
        filled.map(kind =>
          recordHealthApi({ diseaseId: HEALTH_RECORD_DISEASES[kind].diseaseId, healthValue: Number(values[kind]) }),
        ),
      );
      const failedIndex = results.findIndex(result => result.status === 'rejected');
      if (failedIndex === -1) {
        onSaved();
        return;
      }

      const failure = results[failedIndex] as PromiseRejectedResult;
      logApiError('건강 수치 기록 실패', failure.reason);
      // 이미 저장된 항목은 다시 누를 때 중복 저장되지 않게 비우고, 실패한 항목만 남김
      setValues(prev => {
        const next = { ...prev };
        filled.forEach((kind, index) => {
          if (results[index].status === 'fulfilled') next[kind] = '';
        });
        return next;
      });
      // 레포트 시각(마감) 이후면 서버가 "지금은 건강 수치를 입력할 수 없습니다."를 줌 — 그대로 안내
      setErrorMessage(getApiErrorMessage(failure.reason) ?? DEFAULT_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state: { values, isSubmitting, errorMessage },
    actions: { setValue, handleSave },
  };
}
