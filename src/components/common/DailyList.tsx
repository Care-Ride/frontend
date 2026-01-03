import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import Car from '../../assets/drivingRecord/car.svg';
import ArrowLeft from '../../assets/common/arrow_left.svg';
import ArrowRight from '../../assets/common/arrow_right.svg';

type Rows = {
  id: number;
  time: string;
  harshAccel: number;
  harshBrake: number;
  harshDecel: number;
  distance: string;
  duration: string;
};

type DailyListProps = {
  month: number;
  date: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  rows: Rows[];
};

const DailyList: React.FC<DailyListProps> = ({
  date,
  onPrevMonth,
  onNextMonth,
  rows,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setExpandedId(rows[0]?.id ?? null);
  }, [rows]);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <SectionContainer>
      <SectionHeaderContainer>
        <MonthNav>
          <ArrowButton onPress={onPrevMonth}>
            <ArrowLeft />
          </ArrowButton>

          <SectionTitle>{date}</SectionTitle>

          <ArrowButton onPress={onNextMonth}>
            <ArrowRight />
          </ArrowButton>
        </MonthNav>

        <RightIconWrapper>
          <Car />
        </RightIconWrapper>
      </SectionHeaderContainer>

      <DashedDivider />

      {rows.map(row => {
        const isExpanded = expandedId === row.id;

        return (
          <RowWrapper key={row.id}>
            <RecordHeaderRow>
              <RecordTime>{row.time}</RecordTime>
              <RecordTitle>운전 기록</RecordTitle>
              <ToggleButton
                $opened={isExpanded}
                onPress={() => toggleExpand(row.id)}
              >
                <ToggleText $opened={isExpanded}>
                  {isExpanded ? '닫기' : '열기'}
                </ToggleText>
              </ToggleButton>
            </RecordHeaderRow>

            {isExpanded && (
              <DetailCard>
                <DetailRow>
                  <DetailLabel>급가속</DetailLabel>
                  <DetailValue>{row.harshAccel}회</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>급제동</DetailLabel>
                  <DetailValue>{row.harshBrake}회</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>급감속</DetailLabel>
                  <DetailValue>{row.harshDecel}회</DetailValue>
                </DetailRow>

                <InnerDivider />

                <DetailRow>
                  <DetailLabel>주행 거리</DetailLabel>
                  <DetailValue>{row.distance}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>주행 시간</DetailLabel>
                  <DetailValue>{row.duration}</DetailValue>
                </DetailRow>
              </DetailCard>
            )}

            {!isExpanded && <DashedDivider />}
          </RowWrapper>
        );
      })}
    </SectionContainer>
  );
};

export default DailyList;

const SectionContainer = styled.View`
  margin-top: 24px;
`;

const SectionHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MonthNav = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const ArrowButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  background-color: #6d767f;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 600;
  margin: 0 12px;
`;

const RightIconWrapper = styled.View`
  width: 60px;
  height: 40px;
  align-items: flex-end;
  justify-content: center;
  opacity: 0.4;
`;

const DashedDivider = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #d0d0d0;
  border-style: dashed;
`;

const RowWrapper = styled.View``;

const RecordHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
`;

const RecordTime = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  color: #555555;
`;

const RecordTitle = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  margin-left: 8px;
  color: #111111;
`;

const ToggleButton = styled.TouchableOpacity<{ $opened: boolean }>`
  padding: 8px 18px;
  border-radius: 22px;
  background-color: ${({ theme, $opened }) =>
    $opened ? '#111827' : theme.colors.yellowPrimary};
  border-width: 1px;
  border-color: ${({ $opened }) => ($opened ? '#111827' : '#a47e14')};
`;

const ToggleText = styled.Text<{ $opened: boolean }>`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  font-weight: 600;
  color: ${({ $opened }) => ($opened ? '#ffffff' : '#000000')};
`;

const DetailCard = styled.View`
  padding: 16px 18px;
  border-radius: 0 0 18px 18px;
  background-color: #fff7e1;
  border-width: 1px;
  border-color: #f2c15d;
  border-style: dashed;
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const DetailLabel = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  color: #333333;
`;

const DetailValue = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  font-weight: 600;
  color: #333333;
`;

const InnerDivider = styled.View`
  margin-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #e0d0a0;
`;
