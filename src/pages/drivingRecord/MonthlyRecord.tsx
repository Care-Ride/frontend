import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import BackButton from '../../components/common/BackButton';
import Car from '../../assets/drivingRecord/car.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import MonthlyList from '../../components/common/MonthlyList';
import StarFilled from '../../assets/drivingRecord/star_filled.svg';
import StarEmpty from '../../assets/drivingRecord/star_empty.svg';
import { getMonthlyDrive } from '../../api/driving-controller';
import {
  getCurrentYearMonth,
  addMonthsToYearMonth,
  formatYearMonthKR,
} from '../../utils/date';

type MonthlyData = {
  month: number;
  avgScore: number;
  hardAccelStar: number;
  hardDecelStar: number;
};

const MonthlyRecord = () => {
  const [score, setScore] = useState(93);
  const [name, setName] = useState('이승진');
  const [yearMonth, setYearMonth] = useState(getCurrentYearMonth());
  const [monthlyData, setMonthlyData] = useState<MonthlyData | null>(null);
  const currentYearMonth = getCurrentYearMonth();

  const yearMonthKR = formatYearMonthKR(yearMonth);

  const handlePrevMonth = () =>
    setYearMonth(prev => addMonthsToYearMonth(prev, -1));

  //현재 달 이후로는 못넘어가도록
  const handleNextMonth = () =>
    setYearMonth(prev => {
      if (prev >= currentYearMonth) return prev;
      return addMonthsToYearMonth(prev, 1);
    });

  const readMonthlyDrive = async () => {
    try {
      const response = await getMonthlyDrive(yearMonth);
      const data = response?.data.data;
      setMonthlyData({
        month: data.month,
        avgScore: data.avgScore,
        hardAccelStar: data.hardAccelStar,
        hardDecelStar: data.hardDecelStar,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    readMonthlyDrive();
  }, [yearMonth]);

  const accelStar = monthlyData?.hardAccelStar ?? 0;
  const decelStar = monthlyData?.hardDecelStar ?? 0;

  const rows = [
    {
      label: '급가속',
      right: (
        <RatingPill>
          {[1, 2, 3, 4, 5].map(i =>
            i <= accelStar ? <StarFilled key={i} /> : <StarEmpty key={i} />,
          )}
        </RatingPill>
      ),
    },
    {
      label: '급감속',
      right: (
        <RatingPill>
          {[1, 2, 3, 4, 5].map(i =>
            i <= decelStar ? <StarFilled key={i} /> : <StarEmpty key={i} />,
          )}
        </RatingPill>
      ),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <Title>나의 운전 기록</Title>

        <ScoreContainer>
          <Score>{monthlyData?.avgScore}점</Score>
          <Description>
            {monthlyData?.avgScore != null && monthlyData.avgScore >= 80
              ? `${formatYearMonthKR} 모범 운전자입니다`
              : '안전운전, 조금 더 분발하세요!'}
          </Description>
        </ScoreContainer>
        <MonthlyList
          yearMonth={yearMonthKR}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          rows={rows}
        />
      </Container>
    </SafeAreaView>
  );
};

export default MonthlyRecord;

const Container = styled.View`
  flex: 1;
  padding: 0 20px 20px 20px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(24 * theme.fontScale)};
  font-weight: 600;
  text-align: center;
  margin-top: 8px;
`;

const ScoreContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.bluePrimary};
  margin-top: 16px;
  border-radius: 16px;
  padding: 24px 0;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Score = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(32 * theme.fontScale)};
  color: ${({ theme }) => theme.colors.yellowPrimary};
  font-weight: 800;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  color: white;
  font-weight: 700;
`;

const RatingPill = styled.View`
  flex-direction: row;
  padding: 8px 14px;
  border-radius: 22px;
  border-width: 1px;
  border-color: #6d97d1;
  background-color: white;
`;
