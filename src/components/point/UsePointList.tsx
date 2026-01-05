import React, { ReactNode } from 'react';
import styled from 'styled-components/native';
import Car from '../../assets/drivingRecord/car.svg';
import ArrowLeft from '../../assets/common/arrow_left.svg';
import ArrowRight from '../../assets/common/arrow_right.svg';
import { UsePointListProps } from '../../pages/point/UsePoint';

type MonthlyListProps = {
  point: number;
  rows: UsePointListProps[];
};

const UsePointList: React.FC<MonthlyListProps> = ({ point, rows }) => {
  return (
    <SectionContainer>
      <SectionHeaderContainer>
        <SectionTitle>잔여포인트 {point}P</SectionTitle>

        <RightIconWrapper>
          <Car />
        </RightIconWrapper>
      </SectionHeaderContainer>

      <DashedDivider />
      {rows.map((row, index) => {
        const isDisabled = row.status === '구매불가';

        return (
          <RowWrapper key={index}>
            <ProductContainer>
              <Image source={{ uri: row.picture }} />

              <DescriptionContainer>
                <Title>{row.brand}</Title>
                <Description>{row.productName}</Description>
                <BuyContainer>
                  <Description>{row.price}P</Description>

                  <BuyButton
                    $disabled={isDisabled}
                    disabled={isDisabled}
                    activeOpacity={0.7}
                  >
                    <BuyButtonText $disabled={isDisabled}>
                      {row.status}
                    </BuyButtonText>
                  </BuyButton>
                </BuyContainer>
              </DescriptionContainer>
            </ProductContainer>

            <DashedDivider />
          </RowWrapper>
        );
      })}
    </SectionContainer>
  );
};

export default UsePointList;
const SectionContainer = styled.View`
  margin-top: 24px;
`;

const SectionHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 600;
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

const ProductContainer = styled.View`
  flex-direction: row;
  margin: 10px 0;
  gap: 10px;
`;

const Image = styled.Image`
  width: 100px;
  height: 100px;
`;

const DescriptionContainer = styled.View`
  flex: 1;
  justify-content: space-evenly;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray500};
`;
const Description = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  font-weight: 600;
`;

const BuyContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const BuyButton = styled.TouchableOpacity<{ $disabled: boolean }>`
  border-radius: 33px;
  background-color: ${({ $disabled }) => ($disabled ? '#A0A0A0' : '#F8C129')};
  padding: 3px 12px;
`;

const BuyButtonText = styled.Text<{ $disabled: boolean }>`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  font-weight: 500;
  color: ${({ $disabled }) => ($disabled ? '#FFFFFF' : '#000000')};
`;
