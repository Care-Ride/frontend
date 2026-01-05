import React from 'react';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';

type Props = {
  text?: string;
  onPress: () => void;
  disabled?: boolean;
};

const StartButton = ({ text = '시작하기', onPress, disabled }: Props) => {
  return (
    <Container onPress={onPress} activeOpacity={0.8} disabled={disabled}>
      <Text>{text}</Text>
    </Container>
  );
};

export default StartButton;

const Container = styled.TouchableOpacity`
  width: 65%;
  height: 70px;
  border-radius: 33px;
  align-items: center;
  align-self: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.bluePrimary};
  margin-top: 100px;
`;

const Text = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  color: white;
`;
