import React, { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STOMP_BASE_URL } from '@env';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BottomButton } from '../../components/common/BottomButton';
import DotLoading from '../../components/loading/DotLoading';
import { postDriveEnd } from '../../api/driving-controller';
import Tts from 'react-native-tts';
import SoundOn from '../../assets/drivingAction/sound_on.svg';
import SoundOff from '../../assets/drivingAction/sound_off.svg';

// 센서
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import { Subscription } from 'rxjs';

import Geolocation from 'react-native-geolocation-service';

// WebSocket
import { Client, IMessage } from '@stomp/stompjs';

const TTS_ENABLED_KEY = 'ttsEnabled';

// 감지 파라미터
const SENSOR_INTERVAL_MS = 50; // 20Hz
const LP_ALPHA = 0.9;
const EMA_ALPHA = 0.42;

const MIN_SPEED_MPS = 1.2; // 이벤트 기본 게이트
const MIN_SPEED_FOR_ACCEL_MPS = 2.0; // (패치3) 급가속만 더 빡세게
const MIN_EVENT_DURATION_MS = 140;
const EVENT_COOLDOWN_MS = 750;

const ACCEL_THRESHOLD = 2.6;
const BRAKE_THRESHOLD = -2.0;
const HYSTERESIS = 0.5;

const CALIB_MS = 4000;

// suddenStop(옵션)
const STOP_SPEED_MPS = 0.5;
const STOP_HOLD_MS = 1500;

// (패치2) 급제동 직후 급가속 감지 억제 시간
const SUPPRESS_ACCEL_AFTER_BRAKE_MS = 1800;

// Haversine 거리(미터)
const toRad = (deg: number) => (deg * Math.PI) / 180;

const getDistanceMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const DrivingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { driveId, currentLat, currentLon } = route.params || {};

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [hardAccelCount, setHardAccelCount] = useState(0);
  const [hardDecelCount, setHardDecelCount] = useState(0);
  const [suddenStopCount, setSuddenStopCount] = useState(0);

  const [totalDistance, setTotalDistance] = useState(0.0);

  // 쿨다운
  const lastAccelEventTimeRef = useRef(0);
  const lastBrakeEventTimeRef = useRef(0);

  // (패치2) 급제동 후 급가속 억제
  const suppressAccelUntilRef = useRef(0);

  // 센서 필터
  const gravityRef = useRef({ x: 0, y: 0, z: 0 });
  const emaForwardRef = useRef(0);

  // 전방축 자동 선택
  const calibratingRef = useRef(true);
  const calibStartRef = useRef(0);
  const calibAbsSumRef = useRef({ x: 0, y: 0, z: 0 });
  const forwardAxisRef = useRef<'x' | 'y' | 'z'>('y');

  // 이벤트 상태
  const eventRef = useRef<{
    inEvent: boolean;
    sign: 1 | -1 | 0;
    startedAt: number;
    peak: number;
  }>({ inEvent: false, sign: 0, startedAt: 0, peak: 0 });

  // 속도(EMA)
  const speedRef = useRef<number>(0);

  // suddenStop 판단용
  const lastBrakeEndedAtRef = useRef<number>(0);
  const stopHoldStartRef = useRef<number | null>(null);
  const stopCountedForBrakeRef = useRef(false);

  // 디버그 표시용
  const [currentAccel, setCurrentAccel] = useState({ x: 0, y: 0, z: 0 });

  // 위치
  const lastPositionRef = useRef<{ lat: number; lon: number } | null>(null);
  const lastCurrentPosRef = useRef<{
    currentLat: number;
    currentLon: number;
  } | null>(null);

  // WebSocket
  const stompClientRef = useRef<Client | null>(null);
  const stompConnectedRef = useRef(false);

  const lastSentAtRef = useRef(0);

  const publishLocation = (payload: {
    lat: number;
    lon: number;
    speed: number;
    heading: number;
    timestamp: number;
  }) => {
    const client = stompClientRef.current;
    if (!client) return;
    if (!stompConnectedRef.current) return;

    client.publish({
      destination: '/pub/location/update',
      body: JSON.stringify(payload),
    });
  };

  // 교통 알림
  const [trafficMessage, setTrafficMessage] = useState<string | null>(null);
  const [trafficDistance, setTrafficDistance] = useState<number | null>(null);

  // TTS
  const [ttsEnabled, setTtsEnabled] = useState(true);

  useEffect(() => {
    (async () => {
      const v = await AsyncStorage.getItem(TTS_ENABLED_KEY);
      if (v != null) setTtsEnabled(v === 'true');
    })();
  }, []);

  const toggleTts = async () => {
    setTtsEnabled(prev => {
      const next = !prev;
      AsyncStorage.setItem(TTS_ENABLED_KEY, String(next));
      if (!next) Tts.stop();
      return next;
    });
  };

  useEffect(() => {
    Tts.setDefaultLanguage('ko-KR');
    Tts.setDefaultRate(0.5);
  }, []);

  const lastSpokenRef = useRef<string | null>(null);
  const lastSpokenAtRef = useRef<number>(0);
  const SPEAK_COOLDOWN_MS = 3000;

  useEffect(() => {
    if (!trafficMessage) return;
    if (!ttsEnabled) return;

    const now = Date.now();
    const distText =
      trafficDistance != null
        ? `약 ${Math.round(trafficDistance)}미터 앞. `
        : '';
    const textToSpeak = `${distText}${trafficMessage}`;

    if (
      lastSpokenRef.current === textToSpeak &&
      now - lastSpokenAtRef.current < SPEAK_COOLDOWN_MS
    ) {
      return;
    }

    lastSpokenRef.current = textToSpeak;
    lastSpokenAtRef.current = now;

    Tts.stop();
    Tts.speak(textToSpeak);
  }, [trafficMessage, trafficDistance, ttsEnabled]);

  // 토큰 로드
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        setAccessToken(token);
      } catch (e) {
        console.log('Failed to load accessToken', e);
      }
    })();
  }, []);

  // 1) 가속도 감지
  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, SENSOR_INTERVAL_MS);

    // 초기화
    gravityRef.current = { x: 0, y: 0, z: 0 };
    emaForwardRef.current = 0;
    eventRef.current = { inEvent: false, sign: 0, startedAt: 0, peak: 0 };

    calibratingRef.current = true;
    calibStartRef.current = Date.now();
    calibAbsSumRef.current = { x: 0, y: 0, z: 0 };
    forwardAxisRef.current = 'y';

    const subscription: Subscription = accelerometer.subscribe(
      ({ x, y, z }) => {
        const now = Date.now();

        // 표시용(원본)
        setCurrentAccel({ x, y, z });

        // (1) 중력 추정 + 제거
        const gPrev = gravityRef.current;
        const gx = LP_ALPHA * gPrev.x + (1 - LP_ALPHA) * x;
        const gy = LP_ALPHA * gPrev.y + (1 - LP_ALPHA) * y;
        const gz = LP_ALPHA * gPrev.z + (1 - LP_ALPHA) * z;
        gravityRef.current = { x: gx, y: gy, z: gz };

        const lx = x - gx;
        const ly = y - gy;
        const lz = z - gz;

        // (2) 전방축 자동 선택
        if (calibratingRef.current) {
          const s = calibAbsSumRef.current;
          s.x += Math.abs(lx);
          s.y += Math.abs(ly);
          s.z += Math.abs(lz);

          if (now - calibStartRef.current >= CALIB_MS) {
            const { x: sx, y: sy, z: sz } = s;
            forwardAxisRef.current =
              sx >= sy && sx >= sz ? 'x' : sy >= sx && sy >= sz ? 'y' : 'z';

            calibratingRef.current = false;

            // 리셋
            emaForwardRef.current = 0;
            eventRef.current = {
              inEvent: false,
              sign: 0,
              startedAt: 0,
              peak: 0,
            };

            console.log('Forward axis calibrated:', forwardAxisRef.current);
          }
          return;
        }

        // (3) 기본 속도 게이트
        if (speedRef.current < MIN_SPEED_MPS) return;

        // (4) 전방 성분
        const axis = forwardAxisRef.current;
        const forward = axis === 'x' ? lx : axis === 'y' ? ly : lz;

        // (5) EMA
        const emaPrev = emaForwardRef.current;
        const ema = emaPrev + EMA_ALPHA * (forward - emaPrev);
        emaForwardRef.current = ema;

        // (6) 이벤트 구간화
        const state = eventRef.current;
        const isAccel = ema >= ACCEL_THRESHOLD;
        const isBrake = ema <= BRAKE_THRESHOLD;

        if (!state.inEvent) {
          // ===== (패치3) 급가속은 속도 조건을 더 빡세게 =====
          // ===== (패치2) 급제동 직후 일정 시간 급가속 억제 =====
          if (isAccel) {
            if (speedRef.current < MIN_SPEED_FOR_ACCEL_MPS) return;
            if (now < suppressAccelUntilRef.current) return;

            eventRef.current = {
              inEvent: true,
              sign: 1,
              startedAt: now,
              peak: ema,
            };
            return;
          }

          if (isBrake) {
            eventRef.current = {
              inEvent: true,
              sign: -1,
              startedAt: now,
              peak: ema,
            };
            return;
          }
          return;
        }

        // 피크 갱신
        if (state.sign === 1) state.peak = Math.max(state.peak, ema);
        if (state.sign === -1) state.peak = Math.min(state.peak, ema);

        // 종료 조건
        const accelEnd = state.sign === 1 && ema < ACCEL_THRESHOLD - HYSTERESIS;
        const brakeEnd =
          state.sign === -1 && ema > BRAKE_THRESHOLD + HYSTERESIS;

        if (accelEnd || brakeEnd) {
          const duration = now - state.startedAt;

          if (duration >= MIN_EVENT_DURATION_MS) {
            if (
              state.sign === 1 &&
              now - lastAccelEventTimeRef.current > EVENT_COOLDOWN_MS
            ) {
              setHardAccelCount(p => p + 1);
              lastAccelEventTimeRef.current = now;
            }

            if (
              state.sign === -1 &&
              now - lastBrakeEventTimeRef.current > EVENT_COOLDOWN_MS
            ) {
              setHardDecelCount(p => p + 1);
              lastBrakeEventTimeRef.current = now;

              // ===== (패치2) 브레이크 끝난 직후 급가속 억제 타이머 세팅 =====
              suppressAccelUntilRef.current =
                now + SUPPRESS_ACCEL_AFTER_BRAKE_MS;

              // suddenStop 준비(옵션)
              lastBrakeEndedAtRef.current = now;
              stopHoldStartRef.current = null;
              stopCountedForBrakeRef.current = false;
            }
          }

          eventRef.current = { inEvent: false, sign: 0, startedAt: 0, peak: 0 };
        } else {
          eventRef.current = state;
        }
      },
      error => {
        console.log('Accelerometer error:', error);
      },
    );

    return () => subscription?.unsubscribe();
  }, []);

  // 2) WebSocket
  useEffect(() => {
    if (!accessToken) return;

    const client = new Client({
      webSocketFactory: () => new WebSocket(`${STOMP_BASE_URL}/location`),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      debug: str => console.log('[STOMP]', str),

      onConnect: frame => {
        console.log('STOMP connected:', frame.headers);
        stompConnectedRef.current = true;

        client.subscribe('/user/sub/traffic', (message: IMessage) => {
          try {
            const response = JSON.parse(message.body);
            setTrafficMessage(response.message);
            setTrafficDistance(response.distance);
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
      stompConnectedRef.current = false;
      client.deactivate();
    };
  }, [accessToken]);

  // 3) GPS 거리/속도
  useEffect(() => {
    let watchId: number | null = null;

    (async () => {
      // const ok = await hasLocationPermission();
      // if (!ok) {
      //   console.log('위치 권한이 없습니다.');
      //   return;
      // }

      watchId = Geolocation.watchPosition(
        position => {
          const {
            latitude: currentLat,
            longitude: currentLon,
            speed,
          } = position.coords;

          // speed EMA
          if (typeof speed === 'number' && !Number.isNaN(speed)) {
            const prev = speedRef.current;
            speedRef.current = prev + 0.25 * (speed - prev);
          }

          // 거리 누적
          if (lastPositionRef.current) {
            const { lat: lastLat, lon: lastLon } = lastPositionRef.current;
            const dist = getDistanceMeters(
              lastLat,
              lastLon,
              currentLat,
              currentLon,
            );

            if (dist > 2 && dist < 80) {
              setTotalDistance(prev => prev + dist);
            }
          }
          lastPositionRef.current = { lat: currentLat, lon: currentLon };

          console.log('[GPS] currentLat/currentLon:', {
            currentLat,
            currentLon,
            speed,
            now: Date.now(),
          });
          lastCurrentPosRef.current = {
            currentLat: currentLat,
            currentLon: currentLon,
          };

          // suddenStop(옵션)
          const now = Date.now();

          if (now - lastSentAtRef.current >= 1000) {
            lastSentAtRef.current = now;

            publishLocation({
              lat: currentLat,
              lon: currentLon,
              speed:
                typeof speed === 'number' && !Number.isNaN(speed) ? speed : 0,
              heading: 0,
              timestamp: now,
            });
          }
          const sinceBrake = now - lastBrakeEndedAtRef.current;

          if (
            lastBrakeEndedAtRef.current > 0 &&
            sinceBrake < 6000 &&
            !stopCountedForBrakeRef.current
          ) {
            if (speedRef.current <= STOP_SPEED_MPS) {
              if (stopHoldStartRef.current == null) {
                stopHoldStartRef.current = now;
              } else if (now - stopHoldStartRef.current >= STOP_HOLD_MS) {
                stopCountedForBrakeRef.current = true;
                setSuddenStopCount(p => p + 1);
              }
            } else {
              stopHoldStartRef.current = null;
            }
          }
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
    })();

    return () => {
      if (watchId != null) Geolocation.clearWatch(watchId);
    };
  }, []);

  const totalKm = (totalDistance / 1000).toFixed(2);

  const createDriveEnd = async () => {
    const currentLat = lastCurrentPosRef.current?.currentLat;
    const currentLon = lastCurrentPosRef.current?.currentLon;

    if (currentLat == null || currentLon == null) {
      console.log('현재 위치를 아직 받지 못했습니다.');
      return;
    }

    await postDriveEnd(
      driveId,
      totalKm,
      hardAccelCount,
      hardDecelCount,
      suddenStopCount,
      currentLat,
      currentLon,
    );
    navigation.navigate('DrivingDone' as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <SoundButton
          $enabled={ttsEnabled}
          onPress={toggleTts}
          accessibilityRole="button"
          accessibilityLabel={
            ttsEnabled
              ? '음성안내 켜짐. 다시 누르면 음성안내가 꺼집니다.'
              : '음성 안내 꺼짐. 다시 누르면 음성안내가 켜집니다.'
          }
        >
          {ttsEnabled ? (
            <SoundOn width={20} height={20} />
          ) : (
            <SoundOff width={20} height={20} />
          )}
          <SoundText $enabled={ttsEnabled}>
            {ttsEnabled ? '음성 안내 켜짐' : '음성 안내 꺼짐'}
          </SoundText>
        </SoundButton>

        <TitleText>운전중</TitleText>
        <DotLoading />

        <InfoBox>
          <CountText>급가속: {hardAccelCount} 회</CountText>
          <CountText>급감속: {hardDecelCount} 회</CountText>
          <CountText>급정지: {suddenStopCount} 회</CountText>
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
  margin: 50px 20px 0px 20px;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(57 * theme.fontScale)};
  font-weight: 700;
  margin-top: 100px;
`;

const SoundButton = styled.Pressable<{ $enabled: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 10px 17px;
  border-radius: 60px;
  border-width: 1px;
  align-self: flex-end;
  gap: 10px;

  background-color: ${({ $enabled }) => ($enabled ? '#F8C129' : '#F3F4F6')};
  border-color: ${({ $enabled }) => ($enabled ? '#F8c129' : '#D1D5DB')};
`;

const SoundText = styled.Text<{ $enabled: boolean }>`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 700;
  color: #000000;
`;

const InfoBox = styled.View`
  width: 100%;
  margin-top: 40px;
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e0e0e0;
`;

const CountText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 600;
  margin-top: 4px;
`;

const TrafficText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  margin-top: 4px;
`;

const TrafficSubText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(13 * theme.fontScale)};
  color: #888;
  margin-top: 2px;
`;
