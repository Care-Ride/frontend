import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';

import { theme } from './src/styles/theme';
import AppStack from './src/navigation/AppStack';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
