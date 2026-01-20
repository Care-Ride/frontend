import React, { useEffect, useCallback, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { FontLevelProvider } from './src/FontLevelProvider';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import AppStack from './src/navigation/AppStack';
import AuthStack from './src/navigation/AuthStack';
import { navigationRef } from './src/navigation/NavigationRef';

import { useAuth, AuthProvider } from './src/AuthContext';

import AsyncStorage from '@react-native-async-storage/async-storage';

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: '위치 권한 필요',
      message: '앱 이용을 위해 현재 위치가 필요합니다.',
      buttonPositive: '허용',
      buttonNegative: '거부',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

const Gate: React.FC = () => {
  const { state } = useAuth();
  const accessToken = state.tokens?.accessToken ?? null;

  useEffect(() => {
    (async () => {
      const ok = await requestLocationPermission();
      if (!ok) return;

      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;

          // 필요하면 저장 (예: AsyncStorage / 전역상태)
          AsyncStorage.setItem('lastLat', String(latitude));
          AsyncStorage.setItem('lastLon', String(longitude));
        },
        err => {
          console.error(err);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    })();
  }, []);

  if (accessToken) {
    AsyncStorage.setItem('accessToken', accessToken);
  }
  console.log('accesToken', state);

  return (
    <NavigationContainer
      key={accessToken ? 'app' : 'auth'}
      ref={navigationRef}
      //onReady={updatePrivacyByRoute}
      //onStateChange={updatePrivacyByRoute}
    >
      {accessToken ? <AppStack /> : <AuthStack />}
      {/* <LoadingModal /> */}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      {/* <JotaiProvider store={store}> */}
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <FontLevelProvider>
            <Gate />
          </FontLevelProvider>
        </QueryClientProvider>
      </AuthProvider>
      {/* </JotaiProvider> */}
    </SafeAreaProvider>
  );
}
