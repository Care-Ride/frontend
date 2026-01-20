import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomStepButtons from '../../components/common/BottomStepButton';
import SelectTransportationComponent from '../../components/common/SelectTransportationComponent';
import { postDriveStart } from '../../api/driving-controller';
import StartButton from '../../components/common/StartButton';

const ReactivityTest = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { currentLat, currentLon } = route.params || {};

  type Phase = 'intro' | 'waiting' | 'go' | 'result';

  const [phase, setPhase] = useState<Phase>('intro');
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handleStart = () => {
    setReactionTime(null);
    startTimeRef.current = null;
    setPhase('waiting');
  };

  // 초록 -> 빨강으로 바뀌는 타이머
  useEffect(() => {
    if (phase !== 'waiting') {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const delay = 2000 + Math.random() * 3000; // 2~5초 사이 랜덤
    timerRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setPhase('go');
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [phase]);

  const handleTouchBoxPress = () => {
    if (phase === 'waiting') {
      // 아직 초록색일 때 누른 경우 → 그냥 무시하거나 안내문 추가 가능
      return;
    }

    if (phase === 'go' && startTimeRef.current) {
      const now = Date.now();
      const diffSec = (now - startTimeRef.current) / 1000;
      setReactionTime(diffSec);
      setPhase('result');
    }
  };

  const handleRetry = () => {
    setReactionTime(null);
    setPhase('waiting');
  };

  const createDriving = async () => {
    try {
      const response = await postDriveStart(currentLat, currentLon);

      const driveId = response?.data?.data?.driveId;

      if (!driveId) {
        console.log('driveId가 응답에 없습니다.', response?.data);
        return;
      }
      console.log('driveId', driveId);

      navigation.navigate('DrivingScreen', {
        driveId,
        currentLat,
        currentLon,
      } as never);
    } catch (e) {
      console.log('운전 시작 실패:', e);
    }
  };
  const bgColor =
    phase === 'waiting' ? '#35B66A' : phase === 'go' ? '#E55447' : '#35B66A';

  const isSlow = reactionTime != null && reactionTime >= 1;

  const descriptionText =
    phase === 'result'
      ? isSlow
        ? '오늘은 다른 이동 수단을\n사용하시는 것은 어떤 선택일까요?'
        : ''
      : phase === 'go' || phase === 'waiting'
      ? ''
      : '초록색이 빨간색으로 바뀌는 순간 화면을 클릭해주세요.';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <Title>운전 점검</Title>

        {phase === 'result' && reactionTime != null ? (
          <>
            {!isSlow && <SuccessText>{reactionTime.toFixed(3)} 초</SuccessText>}
            {isSlow && (
              <ResultTimeText>{reactionTime.toFixed(3)} 초</ResultTimeText>
            )}
            {isSlow && <Description>{descriptionText}</Description>}
          </>
        ) : (
          <Description>{descriptionText}</Description>
        )}

        {phase === 'intro' ? (
          <StartButton onPress={handleStart} text="시작하기" />
        ) : phase !== 'result' ? (
          <TouchBox onPress={handleTouchBoxPress} activeOpacity={0.8}>
            <ColorBox bgColor={bgColor}>
              {phase === 'go' && <PressText>눌러주세요</PressText>}
            </ColorBox>
          </TouchBox>
        ) : isSlow ? (
          <SelectTransportationComponent />
        ) : (
          <SafeDrivingText>안전운전 하세요!</SafeDrivingText>
        )}

        {phase === 'result' ? (
          isSlow ? (
            <BottomStepButtons
              onPressPrev={() => navigation.goBack()}
              onPressNext={createDriving}
              prevText="이전"
              nextText="운전하기"
            />
          ) : (
            <BottomStepButtons
              onPressPrev={handleRetry}
              onPressNext={createDriving}
              prevText="다시 측정하기"
              nextText="운전하기"
            />
          )
        ) : (
          <BottomStepButtons
            onPressPrev={() => navigation.goBack()}
            prevText="이전"
            disabledNext={true}
          />
        )}
      </Container>
    </SafeAreaView>
  );
};

export default ReactivityTest;

const Container = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 24px;
  align-self: center;
  margin: 20px 0 40px 0;
  font-weight: 600;
`;

const Description = styled.Text`
  width: 80%;
  align-self: center;
  font-size: ${({ theme }) => theme.scaleFont(25 * theme.fontScale)};
  font-weight: 500;
  color: #111111;
  text-align: center;
  line-height: 40px;
  margin-bottom: 40px;
  margin-top: 100px;
`;

const TouchBox = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
`;

const ColorBox = styled.View<{ bgColor: string }>`
  width: 75%;
  height: 260px;
  border-radius: 24px;
  background-color: ${({ bgColor }) => bgColor};
  justify-content: center;
  align-items: center;
`;

const PressText = styled.Text`
  color: white;
  font-size: ${({ theme }) => theme.scaleFont(30 * theme.fontScale)};
  font-weight: 500;
`;

const SafeDrivingText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(30 * theme.fontScale)};
  font-weight: 600;
  align-self: center;
  margin-top: 50px;
`;

const ResultTimeText = styled.Text`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
`;

const SuccessText = styled.Text`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-top: 150px;
  color: #35b66a;
`;
