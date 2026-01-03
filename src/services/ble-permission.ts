import { PermissionsAndroid, Platform } from 'react-native';

export async function ensureBlePermissionsAndroid() {
  if (Platform.OS !== 'android') return true;

  // Android 12+ 권한
  const scan = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  );
  const connect = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  );

  return scan === 'granted' && connect === 'granted';
}
