import { useEffect } from 'react';
import { Alert } from 'react-native';
import { logApiError } from '@shared/api';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 돌봄대상자 관리 화면이 연동 상세/수정
// API(getConnectionDetailApi/updateConnectionApi)를 직접 써야 해서 의도적으로 참조함
// (순환참조 없음, account-link는 ward-management를 참조하지 않음).
import { getConnectionDetailApi, updateConnectionApi } from '@features/account-link/api';
import { updateWardSettingApi } from '../api';
import { optionToConnectionFontSize } from '../utils';
import { FontSizeOption, WardInfo } from './types';
import { useSelectedWardStore } from './useSelectedWardStore';

// WardManagementScreen(돌봄대상자 관리 탭)의 데이터 로딩/저장 로직 전부.
// wards 목록 자체는 useSelectedWardStore(getConnectionsApi 기반, 연동 없으면 MOCK_WARDS 폴백) —
// 홈 화면 어르신 전환 스위처·메뉴 드로어와 동일한 소스라, 여기서 수정하면 다른 화면에도 바로 반영됨.
export function useWardManagement() {
  const wards = useSelectedWardStore(state => state.wards);
  const isWardsLoaded = useSelectedWardStore(state => state.isLoaded);

  useEffect(() => {
    if (!isWardsLoaded) {
      useSelectedWardStore.getState().fetchWards();
    }
  }, [isWardsLoaded]);

  // getConnectionsApi(목록)엔 phone/address가 없어서, 실제 연동된 어르신마다 상세(ConnectionDetail)를
  // 따로 불러와 채워 넣음 — mock 폴백 id(연동 안 된 경우)는 실제 백엔드 레코드가 없으니 건너뜀
  useEffect(() => {
    const realWards = wards.filter(ward => !Number.isNaN(Number(ward.id)));
    if (realWards.length === 0) {
      return;
    }
    let cancelled = false;
    Promise.all(
      realWards.map(async ward => {
        try {
          const detail = await getConnectionDetailApi(Number(ward.id));
          return { id: ward.id, phone: detail.phone, address: detail.address };
        } catch (error) {
          logApiError('돌봄대상자 상세 조회 실패', error);
          return null;
        }
      }),
    ).then(details => {
      if (cancelled) {
        return;
      }
      details.forEach(detail => {
        if (detail) {
          useSelectedWardStore.getState().updateWard(detail.id, { phone: detail.phone, address: detail.address });
        }
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWardsLoaded]);

  // nickname/name/phone/address 저장 — updateConnectionApi(PATCH /api/connection/{wardId})로 실제 반영됨.
  // 성공 여부를 반환해서, 호출한 화면이 성공했을 때만 수정 모달을 닫을 수 있게 함.
  async function saveWardInfo(wardId: string, info: WardInfo): Promise<boolean> {
    // 별명을 비운 채로 저장해도 목록엔 이름으로 대체 표시(fetchWards의 초기 매핑과 동일한 규칙).
    // 서버엔 사용자가 입력한 값(빈 문자열 포함) 그대로 보내서 "별명 미설정" 상태 자체는 유지함.
    const displayInfo: WardInfo = { ...info, nickname: info.nickname || info.name };
    const wardIdNumber = Number(wardId);
    // 연동된 어르신이 없어 mock 데이터로 표시 중인 경우엔 보낼 실제 wardId가 없으므로 로컬에만 반영
    if (Number.isNaN(wardIdNumber)) {
      useSelectedWardStore.getState().updateWard(wardId, displayInfo);
      return true;
    }
    try {
      await updateConnectionApi(wardIdNumber, info);
      useSelectedWardStore.getState().updateWard(wardId, displayInfo);
      return true;
    } catch (error) {
      logApiError('돌봄대상자 정보 수정 실패', error);
      Alert.alert('', '정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
      return false;
    }
  }

  // 글자크기/TTS속도 저장 — updateWardSettingApi(PATCH /api/ward-setting/{wardId})로 실제 반영됨.
  // 이 API는 fontSize+ttsRate를 한 번에 같이 받으므로, 바뀐 것만 patch로 받고 나머지는 스토어의
  // 최신값을 그대로 실어서 같이 보냄.
  async function saveWardSetting(wardId: string, patch: { fontSize?: FontSizeOption; ttsRate?: number }) {
    const wardIdNumber = Number(wardId);
    // 연동된 어르신이 없어 mock 데이터로 표시 중인 경우엔 보낼 실제 wardId가 없으므로 로컬 반영만으로 끝
    if (Number.isNaN(wardIdNumber)) {
      return;
    }
    const current = useSelectedWardStore.getState().wards.find(item => item.id === wardId);
    if (!current) return;
    const body = {
      fontSize: optionToConnectionFontSize(patch.fontSize ?? current.fontSize),
      ttsRate: patch.ttsRate ?? current.ttsRate,
    };
    try {
      await updateWardSettingApi(wardIdNumber, body);
    } catch (error) {
      logApiError('어르신 화면 설정 저장 실패', error);
      // TODO: 백엔드가 400 "해당 돌봄대상자의 설정 정보가 존재하지 않습니다"를 반환함 — 이 어르신의
      // ward-setting 레코드가 아직 DB에 없어서 PATCH가 실패하는 것으로 확인됨(2026-08-26). 생성용
      // POST 엔드포인트가 없어 프론트에서 처리 불가 — 백엔드에서 기본 레코드 생성 또는 POST 추가 필요.
      Alert.alert('', '설정 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  return { wards, saveWardInfo, saveWardSetting };
}
