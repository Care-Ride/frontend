import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STOMP_BASE_URL } from '@env';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BottomButton } from '../../components/common/BottomButton';
import DotLoading from '../../components/loading/DotLoading';
import { postDriveEnd } from '../../api/driving-controller';
import { PermissionsAndroid } from 'react-native';

//센서 관련된 import
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import { Subscription } from 'rxjs';
import Geolocation from 'react-native-geolocation-service';

//WebSocket 관련 import
import { Client, IMessage } from '@stomp/stompjs';

const hasLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

const ACCEL_THRESHOLD = 3.0; // m/s^2 이상이면 급가속
const BRAKE_THRESHOLD = -3.0; // m/s^2 이하면 급제동
const EVENT_COOLDOWN_MS = 1000;

//Haversine 거리 계산(미터 단위)
const toRad = (deg: number) => (deg * Math.PI) / 180;

const getDistanceMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371000; // 지구 반지름 (m)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // m
};

const DrivingScreen = () => {
  const navigation = useNavigation<any>();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const route = useRoute<any>();
  const { driveId, destination, lat, lon } = route.params || {};

  //점수
  const [score, setScore] = useState(0);

  //급가속 급제동 카운트 상태
  const [hardAccelCount, setHardAccelCount] = useState(0);
  const [hardDecelCount, setHardDecelCount] = useState(0);
  const [suddenStopCount, setSuddenStopCount] = useState(0);

  //총 이동 거리
  const [totalDistance, setTotalDistance] = useState(0.0);

  //마지막 이벤트 발생 시간
  const lastAccelEventTimeRef = useRef(0);
  const lastStopEventTimeRef = useRef(0);

  //현재 가속도 값 표시
  const [currentAccel, setCurrentAccel] = useState({ x: 0, y: 0, z: 0 });

  //위치 추적용
  const lastPositionRef = useRef<{ lat: number; lon: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  //WebSocket 클라이언트 ref
  const stompClientRef = useRef<Client | null>(null);

  //서버에서 받은 교통 알림 표시용 상태
  const [trafficMessage, setTrafficMessage] = useState<string | null>(null);
  const [trafficDistance, setTrafficDistance] = useState<number | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        console.log(' accessToken:', token);
        setAccessToken(token);
      } catch (e) {
        console.log('Failed to load accessToken', e);
      }
    };

    loadToken();
  }, [accessToken]);

  console.log(accessToken, 'accessToken 떠라');
  //가속도 센서 구독
  useEffect(() => {
    //센서 업데이트 주기(100ms=10Hz)
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);

    //구독 시작
    const subscription: Subscription = accelerometer.subscribe(
      ({ x, y, z }) => {
        const forwardAccel = y;
        const now = Date.now();

        setCurrentAccel({ x, y, z });

        //급가속 감지
        if (
          forwardAccel > ACCEL_THRESHOLD &&
          now - lastAccelEventTimeRef.current > EVENT_COOLDOWN_MS
        ) {
          setHardAccelCount(prev => prev + 1);
          lastAccelEventTimeRef.current = now;
          console.log('Hard Accel Detected');
        }

        //급제동 감지
        if (
          forwardAccel < BRAKE_THRESHOLD &&
          now - lastStopEventTimeRef.current > EVENT_COOLDOWN_MS
        ) {
          setSuddenStopCount(prev => prev + 1);
          lastStopEventTimeRef.current = now;
          console.log('Hard Brake Detected');
        }
      },
      error => {
        console.log('Accelerometer error:', error);
      },
    );

    //언마운터 시 구독 해제
    return () => {
      subscription && subscription.unsubscribe();
    };
  }, []);

  //WebSocket 연결
  useEffect(() => {
    if (!accessToken) {
      console.log('JWT 토큰이 없습니다.');
      return;
    }

    const client = new Client({
      webSocketFactory: () => new WebSocket(`${STOMP_BASE_URL}/location`),

      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },

      debug: str => {
        console.log(`[STOMP]`, str);
      },

      onConnect: frame => {
        console.log('STOMP connected:', frame.headers);

        //서버 알림 구독
        client.subscribe('/user/sub/traffic', (message: IMessage) => {
          try {
            const body = JSON.parse(message.body);
            console.log('Traffic message received:', body);

            setTrafficMessage(body.message);
            setTrafficDistance(body.distance);
          } catch (err) {
            console.error(err);
          }
        });
      },
      onStompError: frame => {
        console.log('STOMP error:', frame.headers['message']);
        console.log('STOMP error details:', frame.body);
      },
      onWebSocketError: event => {
        console.log('WebSocket error:', event);
      },
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      console.log('Deactivate STOMP client');
      client.deactivate();
    };
  }, [accessToken]);

  //위치(GPS) 기반 주행거리 측정
  useEffect(() => {
    const startWatch = async () => {
      const ok = await hasLocationPermission();
      if (!ok) {
        console.log('위치 권한이 없습니다.');
        return;
      }
    };
    watchIdRef.current = Geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;

        if (lastPositionRef.current) {
          const { lat: lastLat, lon: lastLon } = lastPositionRef.current;
          const dist = getDistanceMeters(lastLat, lastLon, latitude, longitude);

          if (dist > 2) {
            setTotalDistance(prev => prev + dist);
          }
        }
        lastPositionRef.current = { lat: latitude, lon: longitude };
      },
      error => {
        console.log('위치 에러', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 5,
        interval: 2000,
        fastestInterval: 1000,
        showsBackgroundLocationIndicator: true,
      },
    );

    startWatch();

    return () => {
      if (watchIdRef.current != null) {
        Geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const createDriveEnd = async () => {
    await postDriveEnd(
      driveId,
      totalDistance,
      hardAccelCount,
      hardDecelCount,
      suddenStopCount,
      score,
      lat,
      lon,
    );
    navigation.navigate('DrivingDone' as any);
  };

  const totalKm = (totalDistance / 1000).toFixed(2);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <Text>운전중</Text>
        <DotLoading />
        <InfoBox>
          <InfoText>
            현재 가속도 (x / y / z): {currentAccel.x.toFixed(2)} /{' '}
            {currentAccel.y.toFixed(2)} / {currentAccel.z.toFixed(2)}
          </InfoText>
          <CountText>급가속: {hardAccelCount} 회</CountText>
          <CountText>급제동: {suddenStopCount} 회</CountText>
          <CountText>주행 거리: {totalKm} km</CountText>

          {trafficMessage && (
            <>
              <TrafficText>{trafficMessage}</TrafficText>
              {trafficDistance != null && (
                <TrafficSubText>
                  약 {trafficDistance.toFixed(1)} m 앞
                </TrafficSubText>
              )}
            </>
          )}
        </InfoBox>
        <BottomButton text="운전 종료하기" onPress={createDriveEnd} />
      </Container>
    </SafeAreaView>
  );
};
export default DrivingScreen;

const Container = styled.View`
  flex: 1;
  margin: 160px 20px 0px 20px;
  align-items: center;
`;

const Text = styled.Text`
  font-size: 57px;
  font-weight: 700;
  margin-top: 50px;
`;
const InfoBox = styled.View`
  width: 100%;
  margin-top: 40px;
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e0e0e0;
`;

const InfoText = styled.Text`
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
`;

const CountText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  margin-top: 4px;
`;
const TrafficText = styled.Text`
  font-size: 15px;
  margin-top: 4px;
`;

const TrafficSubText = styled.Text`
  font-size: 13px;
  color: #888;
  margin-top: 2px;
`;
