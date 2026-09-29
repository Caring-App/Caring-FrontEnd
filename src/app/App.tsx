import '../../global.css';
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { AppProviders } from './providers/AppProviders';
import { RootNavigator } from './navigation/RootNavigator';
import { NoticeHost } from './NoticeHost';

export function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <AppProviders>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootNavigator />
      <NoticeHost />
    </AppProviders>
  );
}
