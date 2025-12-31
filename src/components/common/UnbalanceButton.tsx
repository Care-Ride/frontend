import React from 'react';
import styled from 'styled-components/native';

interface BottomStepButtonsProps {
  onPressPrev: () => void;
  onPressNext: () => void;
  prevText?: string;
  nextText?: string;
  disabledNext?: boolean;
}

const UnbalanceButton = ({
  onPressPrev,
  onPressNext,
  prevText = '뒤로가기',
  nextText = '다음',
  disabledNext = false,
}: BottomStepButtonsProps) => {
  return (
    <Container>
      <PrevButton onPress={onPressPrev} activeOpacity={0.7}>
        <PrevText>{prevText}</PrevText>
      </PrevButton>

      <NextButton
        onPress={onPressNext}
        disabled={disabledNext}
        activeOpacity={disabledNext ? 1 : 0.7}
      >
        <NextText $disabled={disabledNext}>{nextText}</NextText>
      </NextButton>
    </Container>
  );
};

export default UnbalanceButton;

const Container = styled.View`
  width: 100%;

  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.scale(10)}px
    ${({ theme }) => theme.scale(20)}px;
`;

const PrevButton = styled.TouchableOpacity`
  height: ${({ theme }) => theme.scale(52)}px;
  width: 33%;
  border-radius: ${({ theme }) => theme.scale(33)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray200};
`;

const PrevText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(15 * theme.fontScale)};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
`;

const NextButton = styled.TouchableOpacity`
  width: 64%;
  height: ${({ theme }) => theme.scale(52)}px;
  border-radius: ${({ theme }) => theme.scale(33)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.bluePrimary};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const NextText = styled.Text<{ $disabled?: boolean }>`
  font-size: ${({ theme }) => theme.scaleFont(15 * theme.fontScale)};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
  opacity: ${({ $disabled }) => ($disabled ? 0.7 : 1)};
`;
