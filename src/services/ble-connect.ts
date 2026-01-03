import { bleManager, saveDevice } from './ble';
import type { Device } from 'react-native-ble-plx';

export function startScan(onDevice: (d: Device) => void) {
  const seen = new Set<string>();

  bleManager.startDeviceScan(
    null,
    { allowDuplicates: false },
    (error, device) => {
      if (error) return;
      if (!device) return;

      // 이름 있는 장치만 보여주고 싶으면:
      // if (!device.name) return;

      if (!seen.has(device.id)) {
        seen.add(device.id);
        onDevice(device);
      }
    },
  );
}

export function stopScan() {
  bleManager.stopDeviceScan();
}

export async function connectAndRemember(deviceId: string) {
  const device = await bleManager.connectToDevice(deviceId, { timeout: 8000 });
  const ready = await device.discoverAllServicesAndCharacteristics();
  await saveDevice(ready);
  return ready;
}
