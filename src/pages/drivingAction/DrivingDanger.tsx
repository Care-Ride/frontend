import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackButton from '../../components/common/BackButton';
import UnbalanceButton from '../../components/common/UnbalanceButton';
import { postDriveDanger } from '../../api/driving-controller';
import Tts from 'react-native-tts';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const DrivingDanger = () => {
  const navigation = useNavigation<any>();

  const [currentLat, setCurrentLat] = useState<number | null>(null);
  const [currentLon, setCurrentLon] = useState<number | null>(null);

  const [isNightDrive, setIsNightDrive] = useState(false);
  const [weather, setWeather] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [ttsDone, setTtsDone] = useState(false); // 전부 읽으면 true
  const speakQueueRef = useRef<string[]>([]);
  const speakingRef = useRef(false);

  const isLoading = locLoading || loading;
  const uiMessage = isLoading
    ? '위험 정보를 확인 중입니다...'
    : errorMessage
    ? errorMessage
    : weather === 'UNKNOWN' && !isNightDrive
    ? `감지된 위험이 없습니다.\n 안전운전 하세요.`
    : null;

  const hasLocationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  useEffect(() => {
    (async () => {
      setLocLoading(true);
      setLocError(null);

      const ok = await hasLocationPermission();
      if (!ok) {
        setLocLoading(false);
        console.log('위치 권한이 없습니다.');
        return;
      }

      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;

          setCurrentLat(latitude);
          setCurrentLon(longitude);
          setLocLoading(false);
          console.log(
            '[ReactivityTest] current location:',
            latitude,
            longitude,
          );
        },
        err => {
          setLocLoading(false);
          setLocError('현재 위치를 가져오지 못했습니다.');
          console.log('현재 위치 가져오기 실패', err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
      );
    })();
  }, []);

  useEffect(() => {
    let mounted = true;

    const createDanger = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await postDriveDanger(currentLat, currentLon);
        const nextIsNightDrive = response?.data?.data?.isNightDrive ?? false;
        const nextWeather = response?.data?.data?.weather ?? '';

        if (!mounted) return;
        setIsNightDrive(nextIsNightDrive);
        setWeather(nextWeather);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setErrorMessage('위험 정보를 불러오지 못했습니다.');
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    if (locLoading)
      return () => {
        mounted = false;
      };

    if (locError) {
      setErrorMessage(locError);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    if (currentLat == null || currentLon == null)
      return () => {
        mounted = false;
      };

    createDanger();

    return () => {
      mounted = false;
    };
  }, [currentLat, currentLon]);

  // 2) 읽을 문장 만들기
  const dangerQueue = useMemo(() => {
    const q: string[] = [];

    // 날씨가 UNKNOWN이면 "위험 없음" 취급하려는 기존 로직 유지
    const hasWeatherDanger = weather && weather !== 'UNKNOWN';
    if (hasWeatherDanger) {
      // weather 문자열을 그대로 읽는 대신, 문장 형태로 바꾸고 싶으면 여기서 가공
      q.push(`현재 날씨. ${weather}`);
    }

    if (isNightDrive) {
      q.push('야간 운전입니다. 주의하세요!');
    }

    return q;
  }, [weather, isNightDrive]);

  const hasDanger = dangerQueue.length > 0;

  // 3) TTS 세팅 + 큐를 순차 낭독
  useEffect(() => {
    Tts.setDefaultLanguage('ko-KR');
    Tts.setDefaultRate(0.5);

    const speakNext = () => {
      const next = speakQueueRef.current.shift();
      if (!next) {
        speakingRef.current = false;
        setTtsDone(true);
        return;
      }
      speakingRef.current = true;
      Tts.speak(next);
    };

    const onFinish = () => speakNext();

    const onCancel = () => {
      speakingRef.current = false;
      speakQueueRef.current = [];
      setTtsDone(true);
    };

    const onError = () => {
      speakingRef.current = false;
      speakQueueRef.current = [];
      setTtsDone(true);
    };

    // addEventListener가 subscription(=remove 메서드 포함)을 반환하는 버전 대응
    const subFinish: any = Tts.addEventListener('tts-finish', onFinish);
    const subCancel: any = Tts.addEventListener('tts-cancel', onCancel);
    const subError: any = Tts.addEventListener('tts-error', onError);

    return () => {
      Tts.stop();

      // 가장 안전한 해제 방식: subscription.remove()
      subFinish?.remove?.();
      subCancel?.remove?.();
      subError?.remove?.();
    };
  }, []);

  // 위험 정보가 확정된 시점에 “한 번만” 읽기 시작
  useEffect(() => {
    // 로딩/에러 중에는 읽지 않음
    if (loading) return;
    if (errorMessage) {
      setTtsDone(true); // 에러면 버튼 막지 않도록
      return;
    }

    // 위험이 없으면 버튼 막을 이유가 없음
    if (!hasDanger) {
      setTtsDone(true);
      return;
    }

    // 위험이 있으면: 새로 진입/새 데이터일 때 다시 읽기
    setTtsDone(false);
    speakQueueRef.current = [...dangerQueue];

    // 이미 말하는 중이면 중복 시작 방지
    if (speakingRef.current) return;

    Tts.stop(); // 안전하게 초기화 후 시작
    const first = speakQueueRef.current.shift();
    if (!first) {
      setTtsDone(true);
      return;
    }

    speakingRef.current = true;
    Tts.speak(first);
  }, [loading, errorMessage, hasDanger, dangerQueue]);

  // 4) 운전하기 버튼 비활성 조건
  const driveDisabled = hasDanger && !ttsDone;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <StartText>운전 전 위험</StartText>

        {uiMessage ? <NoDangerText>{uiMessage}</NoDangerText> : null}

        <DestinationContainer>
          {weather && weather !== 'UNKNOWN' && (
            <DangerTextContainer>
              <DestinationText>{weather}</DestinationText>
            </DangerTextContainer>
          )}
          {isNightDrive && (
            <DangerTextContainer>
              <DestinationText>야간 운전입니다. 주의하세요!</DestinationText>
            </DangerTextContainer>
          )}
        </DestinationContainer>

        <ButtonContainer>
          {hasDanger && (
            <DescriptionText>
              위험 안내를 음성이 종료된 후에 운전하기 버튼이 활성화됩니다
            </DescriptionText>
          )}

          <UnbalanceButton
            onPressPrev={
              driveDisabled
                ? () => {}
                : () =>
                    navigation.navigate('BasicRuleBelt', {
                      currentLat,
                      currentLon,
                    } as never)
            }
            prevText={'운전하기'}
            onPressNext={() => navigation.navigate('SelectOtherTransportation')}
            nextText="다른 이동수단 이용하기"
          />
        </ButtonContainer>
      </Container>
    </SafeAreaView>
  );
};
export default DrivingDanger;

const Container = styled.View`
  flex: 1;
  margin-top: 130px;
`;
const StartText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(32 * theme.fontScale)};
  align-self: center;
  font-weight: 600;
`;

const NoDangerText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(23 * theme.fontScale)};
  margin-top: 50px;
  text-align: center;
  line-height: 40px;
`;
const DestinationContainer = styled.View`
  display: flex;
  margin: 40px 20px;
  gap: 10px;
`;

const ButtonContainer = styled.View`
  margin-top: 30px;
`;

const DescriptionText = styled.Text`
  align-self: center;
  text-align: center;
  width: 70%;
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  margin-bottom: 10px;
`;

const DangerTextContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 16px;
  height: 55px;
  border-radius: 22px;
  background-color: #feefd2;
  border: 1px solid ${({ theme }) => theme.colors.yellowPrimary};
`;

const DestinationText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  color: ${({ theme }) => theme.colors.bluePrimary};
`;
