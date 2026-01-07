import React from 'react';
import styled from 'styled-components/native';
import Car from '../../assets/drivingRecord/car.svg';
import { BoughtGificonListProps } from '../../pages/point/ReceivedGift';

type MonthlyListProps = {
  productCount: number;
  rows: BoughtGificonListProps[];
  onPressBuy?: (row: BoughtGificonListProps) => void;
};

const GifticonHistory: React.FC<MonthlyListProps> = ({ productCount, rows, onPressBuy }) => {
  return (
    <SectionContainer>
      <SectionHeaderContainer>
        <SectionTitle>상품 {productCount}개</SectionTitle>

        <RightIconWrapper>
          <Car />
        </RightIconWrapper>
      </SectionHeaderContainer>

      <DashedDivider />
      {rows.map((row, index) => {

        return (
          <RowWrapper key={index}>
            <ProductContainer>
              <Image source={{ uri: row.picture }} />

              <DescriptionContainer>
                <Title>{row.brand}</Title>
                <Description>{row.productName}</Description>
                <BuyContainer>
                  <Description></Description>

                  <BarcodeButton
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    onPress={() => onPressBuy?.(row)}
                  >
                    <BarcodeButtonText>
                      바코드 보기
                    </BarcodeButtonText>
                  </BarcodeButton>
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

export default GifticonHistory;
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

const BarcodeButton = styled.TouchableOpacity`
  border-radius: 33px;
  background-color: #F8C129;
  padding: 3px 12px;
`;

const BarcodeButtonText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  font-weight: 500;
  color: #000000;
`;
