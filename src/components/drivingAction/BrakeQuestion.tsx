import React from 'react';
import styled from 'styled-components/native';

type Props = {
  question: string;
  guideText: string;
  image: React.ReactNode;
  onSelect: (choice: 'left' | 'right') => void;
};

const BrakeQuestion: React.FC<Props> = ({
  question,
  guideText,
  image,
  onSelect,
}) => {
  return (
    <>
      <QuestionText>{question}</QuestionText>

      <ImageWrapper>{image}</ImageWrapper>

      <GuideText>{guideText}</GuideText>

      <ButtonContainer>
        <ChoiceButton
          onPress={() => onSelect('left')}
          accessibilityRole="button"
        >
          <ChoiceText>왼쪽</ChoiceText>
        </ChoiceButton>
        <ChoiceButton
          onPress={() => onSelect('right')}
          accessibilityRole="button"
        >
          <ChoiceText>오른쪽</ChoiceText>
        </ChoiceButton>
      </ButtonContainer>
    </>
  );
};

export default BrakeQuestion;

const QuestionText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};

  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
`;

const ImageWrapper = styled.View`
  align-self: center;
  width: 260px;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const GuideText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(17 * theme.fontScale)};
  color: #555555;
  text-align: center;
  margin: 18px 0;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
`;

const ChoiceButton = styled.TouchableOpacity`
  width: 143px;
  height: 52px;
  border-radius: 33px;
  border: 2px solid ${({ theme }) => theme.colors.bluePrimary};
  align-items: center;
  justify-content: center;
  padding-horizontal: 16px;
`;

const ChoiceText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 600;
`;
