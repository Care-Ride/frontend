import React from 'react';
import styled from 'styled-components/native';

export interface ButtonProps {
  onPress: () => void;
  text: string;
  disabled?: boolean;
}

export const BottomButton = ({
  onPress,
  text,
  disabled = false,
}: ButtonProps) => {
  return (
    <Container
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      $disabled={disabled}
      accessibilityState={{ disabled }}
      accessibilityRole="button"
    >
      <ButtonText $disabled={disabled}>{text}</ButtonText>
    </Container>
  );
};

export const SmallBottomButton = ({
  onPress,
  text,
  disabled = false,
}: ButtonProps) => {
  return (
    <SmallContainer
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      $disabled={disabled}
      accessibilityState={{ disabled }}
    >
      <ButtonText $disabled={disabled}>{text}</ButtonText>
    </SmallContainer>
  );
};

const Container = styled.TouchableOpacity<{ $disabled?: boolean }>`
  position: absolute;
  bottom: 20;
  width: 100%;
  height: ${({ theme }) => theme.scale(52)}px;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.scale(33)}px;
  background-color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.grayPrimary : theme.colors.bluePrimary};
`;
const SmallContainer = styled.TouchableOpacity<{ $disabled?: boolean }>`
  position: absolute;
  bottom: 20;
  height: ${({ theme }) => theme.scale(43)}px;
  width: 40%;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.scale(33)}px;
  background-color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.gray200 : theme.colors.bluePrimary};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const ButtonText = styled.Text<{ $disabled?: boolean }>`
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.white : theme.colors.white};
  font-size: ${({ theme }) => theme.scaleFont(16)}px;
  font-weight: 600;
`;
