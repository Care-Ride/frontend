import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components/native';
import BackButton from '../../components/common/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import MonthlyList from '../../components/common/MonthlyList';
import { getPointsHistory } from '../../api/mission-controller';
import {
  getCurrentYearMonth,
  addMonthsToYearMonth,
  formatYearMonthKR,
} from '../../utils/date';

type PointsHistoryItem = {
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
};

const PointList = () => {
  const [yearMonth, setYearMonth] = useState<string>(getCurrentYearMonth());
  const [pointsHistory, setPointsHistory] = useState<PointsHistoryItem[]>([]);

  const yearMonthKR = formatYearMonthKR(yearMonth);
  const handlePrevMonth = () =>
    setYearMonth(prev => addMonthsToYearMonth(prev, -1));
  const handleNextMonth = () =>
    setYearMonth(prev => addMonthsToYearMonth(prev, 1));

  const readPointsHistory = async () => {
    try {
      const response = await getPointsHistory(0, 10, yearMonth);
      const items = response?.data?.data?.content ?? [];
      setPointsHistory(items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    readPointsHistory();
  }, [readPointsHistory]);

  const rows = useMemo(() => {
    return pointsHistory.map(it => {
      const month = it.createdAt.slice(5, 7);
      const day = it.createdAt.slice(8, 10);
      const dateText = `${month}.${day}`;

      const amountText = `${
        it.amount >= 0 ? '+' : ''
      }${it.amount.toLocaleString()}`;
      const balanceText = it.balanceAfter.toLocaleString();
      return {
        label: (
          <TextContainer>
            <Date>{dateText}</Date>
            <Money>{amountText}P</Money>
            <Description>{it.description}</Description>
          </TextContainer>
        ),
        right: <Money>{balanceText}P</Money>,
      };
    });
  }, [pointsHistory]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <Title>포인트 내역 보기</Title>
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

export default PointList;

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
const TextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;
const Date = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  color: #6d767f;
`;
const Description = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  color: #6d767f;
`;
const Money = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 600;
`;
