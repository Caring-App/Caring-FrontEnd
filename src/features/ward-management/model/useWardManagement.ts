import { useEffect } from 'react';
import { getApiErrorMessage, logApiError } from '@shared/api';
import { notifyLoadFailed } from '@shared/model';
// FSD 원칙상 feature끼리 서로 참조하지 않는 게 이상적이지만, 돌봄대상자 관리 화면이 연동 상세/수정
// API(getConnectionDetailApi/updateConnectionApi)를 직접 써야 해서 의도적으로 참조함
// (순환참조 없음, account-link는 ward-management를 참조하지 않음).
import { getConnectionDetailApi, updateConnectionApi } from '@features/account-link/api';
// 어르신 주소가 바뀌면 주변 복지 시설 결과(등록 주소 기준)도 다시 조회해야 해서 캐시 무효화용으로 참조함
// (순환참조 없음, welfare-facility는 ward-management를 참조하지 않음).
import { useWelfareFacilityStore } from '@features/welfare-facility/model';
import { updateWardSettingApi } from '../api';
import { optionToConnectionFontSize } from '../utils';
import { FontSizeOption, WardInfoUpdate } from './types';
import { useSelectedWardStore } from './useSelectedWardStore';
import { showNotice } from '@shared/model';

// 어르신의 화면 설정 레코드(ward_setting)가 서버에 없을 때 백엔드가 주는 400 메시지(WardSettingService.updateSetting).
// 레코드는 회원가입 때만 만들어져서 그 전에 가입한 어르신은 없을 수 있음 — 생성 API가 없어 앱에서는 만들 수 없음
const WARD_SETTING_MISSING_MESSAGE = '해당 돌봄대상자의 설정 정보가 존재하지 않습니다.';

function settingSaveFailedMessage(error: unknown) {
  if (getApiErrorMessage(error) === WARD_SETTING_MISSING_MESSAGE) {
    return '이 어르신의 화면 설정 정보가 서버에 없어 저장할 수 없어요. 관리자에게 문의해 주세요.';
  }
  return '잠시 후 다시 시도해 주세요.';
}

// WardManagementScreen(돌봄대상자 관리 탭)의 데이터 로딩/저장 로직 전부.
// wards 목록 자체는 useSelectedWardStore(getConnectionsApi 기반, 연동 없으면 MOCK_WARDS 폴백) —
// 홈 화면 어르신 전환 스위처·메뉴 드로어와 동일한 소스라, 여기서 수정하면 다른 화면에도 바로 반영됨.
// 백엔드 combineAddress와 같은 규칙(상세 주소가 있으면 공백으로 이어 붙임) — mock 어르신 로컬 반영용
function combineAddress(baseAddress: string, detailAddress: string) {
  return detailAddress.trim() ? `${baseAddress} ${detailAddress.trim()}` : baseAddress;
}

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
          notifyLoadFailed();
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

  // nickname/name/phone/주소 저장 — updateConnectionApi(PATCH /api/connection/{wardId})로 실제 반영됨.
  // 성공 여부를 반환해서, 호출한 화면이 성공했을 때만 수정 모달을 닫을 수 있게 함.
  async function saveWardInfo(wardId: string, update: WardInfoUpdate): Promise<boolean> {
    const ward = useSelectedWardStore.getState().wards.find(item => item.id === wardId);
    if (!ward) return false;
    const { newAddress, ...info } = update;
    // 별명을 비운 채로 저장해도 목록엔 이름으로 대체 표시(fetchWards의 초기 매핑과 동일한 규칙).
    // 서버엔 사용자가 입력한 값(빈 문자열 포함) 그대로 보내서 "별명 미설정" 상태 자체는 유지함.
    const displayNickname = info.nickname || info.name;
    const wardIdNumber = Number(wardId);
    // 연동된 어르신이 없어 mock 데이터로 표시 중인 경우엔 보낼 실제 wardId가 없으므로 로컬에만 반영
    if (Number.isNaN(wardIdNumber)) {
      const address = newAddress ? combineAddress(newAddress.baseAddress, newAddress.detailAddress) : ward.address;
      useSelectedWardStore.getState().updateWard(wardId, { ...info, nickname: displayNickname, address });
      return true;
    }
    try {
      const detail = await updateConnectionApi(wardIdNumber, {
        ...info,
        // 백엔드 PATCH는 baseAddress/detailAddress를 항상 받아서 address를 다시 조합해 저장함. 그런데 상세 조회
        // 응답엔 합쳐진 address만 있어서, 주소를 안 바꿨을 땐 원래 기본/상세 주소를 따로 알 수 없음 —
        // 현재 전체 주소를 baseAddress로 그대로 보내 address가 그대로 유지되게 함(좌표는 백엔드 지오코딩이
        // 실패해도 기존 값을 유지하므로 영향 없음).
        // TODO: 백엔드 상세 응답에 baseAddress/detailAddress가 따로 오면 그 값을 그대로 보내도록 교체
        baseAddress: newAddress?.baseAddress ?? ward.address,
        detailAddress: newAddress?.detailAddress ?? '',
      });
      useSelectedWardStore
        .getState()
        .updateWard(wardId, { ...info, nickname: displayNickname, address: detail.address });
      if (newAddress) {
        useWelfareFacilityStore.getState().invalidate(wardIdNumber);
      }
      return true;
    } catch (error) {
      logApiError('돌봄대상자 정보 수정 실패', error);
      showNotice('', '정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
      return false;
    }
  }

  // 글자크기/TTS속도 저장 — updateWardSettingApi(PATCH /api/ward-setting/{wardId})로 실제 반영됨.
  // 이 API는 fontSize+ttsRate를 한 번에 같이 받으므로, 바뀐 것만 patch로 받고 나머지는 스토어의
  // 최신값을 그대로 실어서 같이 보냄. 화면은 누르는 즉시 바뀌어 있으므로(WardManagementScreen이 먼저 updateWard),
  // previous에 바꾸기 전 값을 받아 두었다가 저장에 실패하면 되돌림 — 안 그러면 저장 안 된 값이 선택된 채로 남음
  async function saveWardSetting(
    wardId: string,
    patch: { fontSize?: FontSizeOption; ttsRate?: number },
    previous?: { fontSize?: FontSizeOption; ttsRate?: number },
  ) {
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
      if (previous) useSelectedWardStore.getState().updateWard(wardId, previous);
      showNotice('설정을 저장하지 못했어요', settingSaveFailedMessage(error));
    }
  }

  return { wards, saveWardInfo, saveWardSetting };
}
