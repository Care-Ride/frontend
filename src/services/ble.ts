import { BleManager, Device } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const bleManager = new BleManager();

const KEY_ID = 'paired_ble_device_id';
const KEY_NAME = 'paired_ble_device_name';

export async function saveDevice(device: Device) {
  await AsyncStorage.multiSet([
    [KEY_ID, device.id],
    [KEY_NAME, device.name ?? '연동된 장치'],
  ]);
}

export async function loadDevice() {
  const [[, id], [, name]] = await AsyncStorage.multiGet([KEY_ID, KEY_NAME]);
  return { id: id ?? null, name: name ?? null };
}

export async function clearDevice() {
  await AsyncStorage.multiRemove([KEY_ID, KEY_NAME]);
}
