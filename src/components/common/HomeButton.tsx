import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/common/logo_yellow.svg';

const HomeButton = () => {
  const navigation = useNavigation();

  return (
    <BackButtonContainer>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        style={{ padding: 0, alignItems: 'center' }}
        accessibilityRole="button"
        accessibilityLabel="홈으로 가기"
      >
        <Logo width={69} height={29.77} />
        <Text>첫 화면으로</Text>
      </TouchableOpacity>
    </BackButtonContainer>
  );
};

export default HomeButton;

const BackButtonContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  width: 100%;
  background-color: white;
`;
const Text = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(10 * theme.fontScale)};
  margin-top: 3px;
`;
