import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import BackButton from '../../components/common/BackButton';
import SettingText from '../../components/common/SettingText';
import { postLinkGenerate } from '../../api/member-controller';

import Timer from '../../assets/common/timer.svg';

const TOTAL_SECONDS = 600; // 10분 = 600초

const GetCode = () => {
  const [code, setCode] = useState<string>('');
  const [remaining, setRemaining] = useState<number>(TOTAL_SECONDS);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const createLinkGenerate = useCallback(async () => {
    const response = await postLinkGenerate();

    const newCode = response?.data?.data?.code;
    if (newCode) {
      setCode(String(newCode).padStart(5, '0'));
    }
    setRemaining(TOTAL_SECONDS);
  }, []);

  useEffect(() => {
    createLinkGenerate();
  }, [createLinkGenerate]);

  useEffect(() => {
    if (remaining <= 0) return;
    const timerId = setInterval(() => {
      setRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, [remaining]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <SettingText
          title="보호자 연동하기"
          description="보호자 휴대폰의 ‘보호자용 앱’에서 아래 5자리 숫자를 입력하도록 전달해주세요"
          showRange={false}
        />

        <Section>
          <Label>연동코드</Label>

          <CodeRow>
            {code.split('').map((ch, idx) => (
              <CodeDigit key={`${ch}-${idx}`}>{ch}</CodeDigit>
            ))}
          </CodeRow>

          <TimerRow>
            <TimerIcon>
              <Timer />
            </TimerIcon>
            <TimerText>남은 시간 {formatTime(remaining)}</TimerText>

            <RefreshButton
              disabled={remaining === 0}
              onPress={createLinkGenerate}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <RefreshButtonText>코드 새로 생성하기</RefreshButtonText>
            </RefreshButton>
          </TimerRow>

          <InfoText>(이 코드는 10분간 유효합니다)</InfoText>
        </Section>
      </Container>
    </SafeAreaView>
  );
};

export default GetCode;

const Container = styled.View`
  flex: 1;
  margin: 0 20px;
`;

const Section = styled.View`
  width: 100%;
  margin-top: 24px;
`;

const Label = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  margin-bottom: 16px;
  font-weight: 500;
`;

const CodeRow = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  gap: 24px;
  margin-bottom: 24px;
`;

const CodeDigit = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(32 * theme.fontScale)};
  font-weight: 600;
`;

const TimerRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const TimerIcon = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  margin-right: 6px;
`;

const TimerText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  margin-right: 8px;
`;

const RefreshButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  padding: 3px 8px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.gray300};
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.gray100 : theme.colors.gray200};
`;

const RefreshButtonText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(12 * theme.fontScale)};
  color: ${({ theme }) => theme.colors.black};
`;

const InfoText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(12 * theme.fontScale)};
  color: ${({ theme }) => theme.colors.gray500};
`;
