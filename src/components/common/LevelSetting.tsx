import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

type LevelSettingScreenProps = {
  level: number;
  minLevel?: number;
  maxLevel?: number;
  onChangeLevel: (level: number) => void;
  onTestPress?: () => void;
  onSavePress?: () => void;
  Icon?: React.ReactNode;
  cardText?: string;
  preview?: React.ReactNode;
};

export const LevelSetting: React.FC<LevelSettingScreenProps> = ({
  level,
  minLevel = 1,
  maxLevel = 6,
  onChangeLevel,
  onTestPress,
  Icon,
  cardText,
  preview,
}) => {
  const handlePlus = () => {
    if (level < maxLevel) onChangeLevel(level + 1);
  };
  const handleMinus = () => {
    if (level > minLevel) onChangeLevel(level - 1);
  };

  return (
    <Container>
      <LevelContainer>
        <PlusMinusButton onPress={handleMinus}>
          <ButtonText>-</ButtonText>
        </PlusMinusButton>
        <LevelText>{level}단계</LevelText>
        <PlusMinusButton onPress={handlePlus}>
          <ButtonText>+</ButtonText>
        </PlusMinusButton>
      </LevelContainer>
      {cardText ? (
        <Card>
          {Icon ? <IconWrapper>{Icon}</IconWrapper> : ''}
          <CardText>{cardText}</CardText>
          {onTestPress && <TestButton onPress={onTestPress} />}
        </Card>
      ) : (
        ''
      )}

      {preview}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  margin-top: 30px;
`;

const LevelContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const PlusMinusButton = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 500px;
  background-color: #6d767f;
`;
const ButtonText = styled.Text`
  font-size: 30px;
  color: white;
`;
const LevelText = styled.Text`
  font-size: 18px;
`;

const Card = styled.View`
  align-self: stretch;
  margin: 15px 10px;
  padding: 20px 0;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.yellowSecondary};
  border: 1px solid ${({ theme }) => theme.colors.yellowPrimary};
  border-radius: 16px;
`;

const IconWrapper = styled.TouchableOpacity`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border: 3px solid ${({ theme }) => theme.colors.yellowPrimary};
  border-radius: 33px;
  padding: 6px;
  width: 40%;
  margin-bottom: 15px;
`;

const CardText = styled.Text`
  font-size: 18px;
`;

const TestButton = styled.TouchableOpacity``;
