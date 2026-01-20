import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components/native';
import BackButton from '../../components/common/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import DailyList from '../../components/common/DailyList';
import { getDailyDrive } from '../../api/driving-controller';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

interface DailyDriveRow {
  id: number;
  time: string;
  harshAccel: number;
  harshBrake: number;
  harshDecel: number;
  distance: string;
  duration: string;
}

const DailyRecord = () => {
  //오늘 날짜 불러오기
  const getTodayISO = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const [date, setDate] = useState(getTodayISO());

  const month = useMemo(() => {
    const [, m] = date.split('-').map(Number);
    return m || 1;
  }, [date]);

  const displayDate = useMemo(() => {
    const [, m, d] = date.split('-').map(Number);
    if (!m || !d) return date;
    return `${m}월 ${d}일`;
  }, [date]);

  const addDays = useCallback((isoDate: string, delta: number) => {
    const [y, m, d] = isoDate.split('-').map(Number);
    const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
    dt.setUTCDate(dt.getUTCDate() + delta);

    const yyyy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const handlePrevDay = () => setDate(prev => addDays(prev, -1));
  const handleNextDay = () => setDate(prev => addDays(prev, +1));

  const mapDriveToRows = (drive: any[]): DailyDriveRow[] => {
    return drive.map((item, index) => {
      const start = new Date(item.startTime);
      return {
        id: index + 1,
        time: start.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        harshAccel: item.hardAccelCount,
        harshBrake: item.hardDecelCount,
        harshDecel: item.hardDecelCount,
        distance: `${item.distance}km`,
        duration: item.duration || '0분',
      };
    });
  };

  const { data: rows = [] } = useQuery({
    queryKey: ['dailyDrive', date],
    queryFn: async () => {
      const response = await getDailyDrive(date);
      const driveList = response?.data?.data?.drive ?? [];
      return mapDriveToRows(driveList);
    },
    enabled: Boolean(date), // date가 있을 때만 실행
    placeholderData: keepPreviousData,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <ScrollContent>
          <Title>일별 운전 기록</Title>
          <Description>
            운전기록은 '운전이 종료된 시점'을 기준으로 합니다
          </Description>

          <DailyList
            month={month}
            date={displayDate}
            onPrevMonth={handlePrevDay}
            onNextMonth={handleNextDay}
            rows={rows}
          />
        </ScrollContent>
      </Container>
    </SafeAreaView>
  );
};

export default DailyRecord;

const Container = styled.View`
  flex: 1;
  padding: 0 20px 20px 20px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  font-weight: 600;
  padding: 30px 0px 10px 0px;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
`;
const ScrollContent = styled.ScrollView.attrs(() => ({}))``;
