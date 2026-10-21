/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import { handleBackgroundMessage } from '@features/notification/utils';
import App from './App';
import { name as appName } from './app.json';

// 앱이 백그라운드거나 꺼져 있을 때 온 FCM 메시지 처리 — 앱 화면이 뜨기 전에도 불려서 반드시 여기(진입점)에서 등록해야 함
setBackgroundMessageHandler(getMessaging(), handleBackgroundMessage);

AppRegistry.registerComponent(appName, () => App);
