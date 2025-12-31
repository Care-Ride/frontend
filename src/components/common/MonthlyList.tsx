import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import Car from '../../assets/drivingRecord/car.svg';
import ArrowLeft from '../../assets/common/arrow_left.svg';
import ArrowRight from '../../assets/common/arrow_right.svg';

type Rows = {
  label: ReactNode;
  right: ReactNode;
};

type MonthlyListProps = {
  yearMonth: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  rows: Rows[];
};

const MonthlyList: React.FC<MonthlyListProps> = ({
  yearMonth,
  onPrevMonth,
  onNextMonth,
  rows,
}) => {
  return (
    <SectionContainer>
      <SectionHeaderContainer>
        <MonthNav>
          <ArrowButton onPress={onPrevMonth}>
            <ArrowLeft />
          </ArrowButton>
          <SectionTitle>{yearMonth}</SectionTitle>
          <ArrowButton onPress={onNextMonth}>
            <ArrowRight />
          </ArrowButton>
        </MonthNav>

        <RightIconWrapper>
          <Car />
        </RightIconWrapper>
      </SectionHeaderContainer>

      <DashedDivider />
      {rows.map((row, index) => (
        <RowWrapper key={index}>
          {/* {index === 0 && <DashedDivider />} */}
          <OptionRow>
            <OptionLabel>{row.label}</OptionLabel>
            <RightContainer>{row.right}</RightContainer>
          </OptionRow>
          <DashedDivider />
        </RowWrapper>
      ))}
    </SectionContainer>
  );
};

export default MonthlyList;
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
  margin-bottom: 7px;
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

const OptionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
`;

const OptionLabel = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  color: ${({ theme }) => theme.colors.black};
`;

const RightContainer = styled.View`
  background-color: white;
`;
