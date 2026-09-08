import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import ChevronRightIcon from '@assets/icons/report/chevron-right.svg';

export interface AddressSearchResult {
  address: string;
  buildingName: string;
  zonecode: string;
}

interface AddressSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (result: AddressSearchResult) => void;
}

// 다음(카카오) 우편번호 서비스 위젯 — 별도 API 키 없이 쓸 수 있음. 웹 전용 위젯이라 WebView에 HTML을
// 직접 심어서 띄우고, 주소를 고르면 daum.Postcode의 oncomplete 콜백에서 postMessage로 RN에 결과를 전달함.
const POSTCODE_HTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>html, body, #wrap { margin: 0; padding: 0; width: 100%; height: 100%; }</style>
</head>
<body>
<div id="wrap"></div>
<script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<script>
  new daum.Postcode({
    oncomplete: function (data) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        address: data.roadAddress || data.jibunAddress,
        buildingName: data.buildingName || '',
        zonecode: data.zonecode || '',
      }));
    },
    width: '100%',
    height: '100%',
  }).embed(document.getElementById('wrap'));
</script>
</body>
</html>`;

// 회원가입 주소 입력 등 다른 화면에서도 재사용할 목적으로 특정 feature가 아니라 shared/ui에 둠.
// 주소만 반환하고 좌표는 안 줘서, 좌표가 필요하면 호출부에서 별도로 지오코딩해야 함
// (@features/place/api의 geocodeApi 참고).
export function AddressSearchModal({ visible, onClose, onSelect }: AddressSearchModalProps) {
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const result = JSON.parse(event.nativeEvent.data) as AddressSearchResult;
      onSelect(result);
    } catch (error) {
      console.error('[AddressSearchModal] 주소 결과 파싱 실패', error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-surface">
        <View className="flex-row items-center gap-2 border-b border-border px-4 py-3">
          <Pressable onPress={onClose} hitSlop={8} className="-rotate-180">
            <ChevronRightIcon width={18} height={18} />
          </Pressable>
          <Text className="text-md font-bold text-text-primary">주소 검색</Text>
        </View>

        {/* 모달이 열려있을 때만 마운트 — 닫힌 상태에서도 웹뷰를 살려두면 불필요한 리소스를 씀 */}
        {visible && (
          <WebView
            originWhitelist={['*']}
            // source.html만 쓰면 페이지 origin이 'about://'(빈 origin)가 되는데, 다음 우편번호
            // 위젯 내부(iframe)가 부모 창으로 postMessage를 보낼 때 그 origin이 유효하지 않다며
            // SyntaxError를 던지고 멈춰서 주소를 눌러도 아무 반응이 없었음 — baseUrl로 실제
            // https origin을 부여해서 해결(실제로 접속 가능한 도메인일 필요는 없음).
            source={{ html: POSTCODE_HTML, baseUrl: 'https://caringfrontend.local/' }}
            onMessage={handleMessage}
            // 다음 우편번호 위젯의 검색 UI는 내부적으로 iframe으로 뜨는데, 안드로이드 웹뷰에서
            // DOM 스토리지가 꺼져있으면 그 iframe 안 주소 클릭이 씹히는 문제가 있어 명시적으로 켬.
            domStorageEnabled
            javaScriptEnabled
            // 기기의 시스템 글자 크기 설정을 웹뷰가 그대로 반영하면 위젯 안의 작은 배지(도로명/지번)가
            // 줄바꿈되며 깨짐 — 웹뷰 텍스트 배율을 100으로 고정(안드로이드 전용 prop).
            textZoom={100}
          />
        )}
      </View>
    </Modal>
  );
}
