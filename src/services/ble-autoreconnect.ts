import { bleManager, loadDevice } from './ble';

export async function autoReconnectOnce() {
  const saved = await loadDevice();
  if (!saved.id) return { connected: false, name: saved.name };

  const device = await bleManager.connectToDevice(saved.id, { timeout: 6000 });
  await device.discoverAllServicesAndCharacteristics();
  return {
    connected: true,
    name: saved.name ?? device.name ?? null,
    deviceId: saved.id,
  };
}
