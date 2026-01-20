import React from 'react';
import styled from 'styled-components/native';
import Search from '../../assets/common/search.svg';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (text: string) => void;
};

const DestinationSearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  onSubmit,
}) => {
  const handleChangeText = (text: string) => {
    onChangeText(text);
    onSubmit(text);
  };

  return (
    <BarContainer>
      <SearchInput
        value={value}
        onChangeText={handleChangeText}
        placeholder="목적지를 입력해주세요"
        placeholderTextColor="#6d767f"
        returnKeyType="search"
        onSubmitEditing={e => onSubmit(e.nativeEvent.text)}
        accessibilityLabel="목적지 입력창"
        accessibilityRole="search"
      />
      <SearchButton
        onPress={() => onSubmit(value)}
        activeOpacity={0.8}
        accessibilityLabel="검색 버튼"
      >
        <Search />
      </SearchButton>
    </BarContainer>
  );
};

export default DestinationSearchBar;

const BarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  height: 55px;
  border-radius: 22px;
  background-color: #feefd2;
  border: 1px solid ${({ theme }) => theme.colors.yellowPrimary};
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black};
`;

const SearchButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;
