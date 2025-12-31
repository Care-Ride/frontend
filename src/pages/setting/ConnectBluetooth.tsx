import SelectList from '../../components/common/SelectList';
import Car from '../../assets/drivingRecord/car.svg';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import styled from 'styled-components/native';
import ToggleButton from '../../components/setting/ToggleButton';
import { Linking, NativeModules, Platform } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import { bleManager, loadDevice, clearDevice } from '../../services/ble';
import { ensureBlePermissionsAndroid } from '../../services/ble-permission';
import { autoReconnectOnce } from '../../services/ble-autoreconnect';

export const openBluetoothSettings = () => {
  if (Platform.OS === 'android') {
    NativeModules.BluetoothSettings.open();
    return;
  }
  Linking.openSettings();
};

const ConnectBluetooth = () => {
  const [bluetoothOn, setBluetoothOn] = useState(true);
  const navigation = useNavigation();
  const [carNum, setCarNum] = useState('아직 연동된 차량이 없습니다');

  useEffect(() => {
    let mounted = true;

    (async () => {
      const ok = await ensureBlePermissionsAndroid();
      if (!ok || !mounted) return;

      const saved = await loadDevice();
      if (mounted && saved.name) setCarNum(saved.name);

      try {
        const res = await autoReconnectOnce();
        if (!mounted) return;
        setBluetoothOn(res.connected);
        if (res.name) setCarNum(res.name);
      } catch {
        if (mounted) setBluetoothOn(false);
      }
    })();

    return () => {
      mounted = false;
      try {
        bleManager?.stopDeviceScan?.();
      } catch {}
    };
  }, []);

  const disconnect = async () => {
    const saved = await loadDevice();
    if (saved.id) {
      try {
        await bleManager.cancelDeviceConnection(saved.id);
      } catch {}
    }
    await clearDevice();
    setBluetoothOn(false);
    setCarNum('아직 연동된 차량이 없습니다');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        {/* <SettingContainer>
          <Title>블루투스 설정</Title>
          <ToggleButton value={bluetoothOn} onChange={setBluetoothOn} />
        </SettingContainer> */}
        <Title>현재 연동된 차량</Title>
        <NumberContainer>
          <NumberText>{carNum}</NumberText>
        </NumberContainer>
        <SelectList
          title="블루투스 연결 설정"
          icon={<Car />}
          options={[
            {
              label: '블루투스 연결',
              onPress: () => openBluetoothSettings(),
            },

            {
              label: '블루투스 연결 해제',
              onPress: disconnect,
            },
          ]}
        />
      </Container>
    </SafeAreaView>
  );
};

export default ConnectBluetooth;

const Container = styled.View`
  flex: 1;
  margin: 0 20px;
`;

const SettingContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 35px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  font-weight: 600;
  padding: 12px 0;
`;
const NumberContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.yellowSecondary};
  border-radius: 30px;
  padding: 15px;
  margin-bottom: 30px;
`;
const NumberText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  font-weight: 500;
  text-align: center;
`;
