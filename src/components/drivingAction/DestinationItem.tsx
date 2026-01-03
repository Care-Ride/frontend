import React from 'react';
import styled from 'styled-components/native';

export type Destination = {
  id: string | number;
  name: string;
  address: string;
  lat: string;
  lon: string;
};

type Props = {
  item: Destination;
  onSelect: (item: Destination) => void;
};

const DestinationItem: React.FC<Props> = ({ item, onSelect }) => {
  return (
    <ItemWrapper>
      <Row>
        <TextBox>
          <Title>{item.name}</Title>
          <Address numberOfLines={2}>{item.address}</Address>
        </TextBox>

        <SelectButton onPress={() => onSelect(item)} activeOpacity={0.8}>
          <SelectText>선택</SelectText>
        </SelectButton>
      </Row>
      <Divider />
    </ItemWrapper>
  );
};

export default DestinationItem;

const ItemWrapper = styled.View`
  padding: 7px 0;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

const TextBox = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const Address = styled.Text`
  font-size: 13px;
  color: #666666;
`;

const SelectButton = styled.TouchableOpacity`
  width: 73px;
  height: 40px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.yellowPrimary};
  border: 1px solid #a47e14;
`;

const SelectText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  color: ${({ theme }) => theme.colors.black};
  font-weight: 600;
`;

const Divider = styled.View`
  margin-top: 15px;
  border-bottom-width: 1px;
  border-bottom-color: #d0d0d0;
  border-style: dashed;
`;
