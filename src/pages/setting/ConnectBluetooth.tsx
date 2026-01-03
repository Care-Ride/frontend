import SelectList from '../../components/common/SelectList';
import Car from '../../assets/drivingRecord/car.svg';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/common/BackButton';
import styled from 'styled-components/native';
import ToggleButton from '../../components/setting/ToggleButton';
import { Linking, Platform, Alert } from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import { bleManager, loadDevice, clearDevice } from '../../services/ble';
import { ensureBlePermissionsAndroid } from '../../services/ble-permission';
import { autoReconnectOnce } from '../../services/ble-autoreconnect';

export const openBluetoothSettings = async () => {
  console.log('[BT] openBluetoothSettings pressed');

  if (Platform.OS === 'android') {
    try {
      // enable()이 지원되는 환경이면 여기서 시스템 프롬프트가 뜨거나 바로 켜져야 함
      console.log('[BT] calling bleManager.enable()...');
      await bleManager.enable();
      console.log('[BT] bleManager.enable() resolved');
      Alert.alert(
        '블루투스',
        '블루투스를 켰습니다(또는 켜기 요청이 처리되었습니다).',
      );
      return;
    } catch (e: any) {
      // enable()이 지원 안 되거나, 권한/OS 정책으로 막히면 여기로 옴
      console.log('[BT] bleManager.enable() rejected:', e?.message || e);
      Alert.alert('블루투스 설정', '블루투스 설정 화면으로 이동합니다.', [
        { text: '확인', onPress: () => Linking.openSettings() },
      ]);
      return;
    }
  }

  // iOS: 블루투스 설정 직접 이동 제한 → 앱 설정
  Alert.alert('설정 이동', '설정 앱으로 이동합니다.', [
    { text: '확인', onPress: () => Linking.openSettings() },
  ]);
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
