import React, { useState } from 'react';
import styled from 'styled-components/native';
import Taxi from '../../assets/alternativeTransportation/taxi.svg';
import Driver from '../../assets/alternativeTransportation/driver.svg';

type UserType = 'GUARDIAN' | 'SENIOR' | null;

interface Props {
  onSelectionChange?: (hasSelection: boolean, selectedType: UserType) => void;
}

const SelectUserTypeComponent: React.FC<Props> = ({ onSelectionChange }) => {
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);

  const handleSelect = (type: Exclude<UserType, null>) => {
    setSelectedUserType(prev => {
      const next = prev === type ? null : type;

      if (onSelectionChange) {
        onSelectionChange(next !== null, next);
      }

      return next;
    });
  };

  return (
    <SelectButtonContainer>
      <SelectButton
        onPress={() => handleSelect('GUARDIAN')}
        isSelected={selectedUserType === 'GUARDIAN'}
      >
        <Driver />
        <ButtonText isSelected={selectedUserType === 'GUARDIAN'}>
          보호자
        </ButtonText>
      </SelectButton>

      <SelectButton
        onPress={() => handleSelect('SENIOR')}
        isSelected={selectedUserType === 'SENIOR'}
      >
        <Taxi />
        <ButtonText isSelected={selectedUserType === 'SENIOR'}>
          운전자
        </ButtonText>
      </SelectButton>
    </SelectButtonContainer>
  );
};

export default SelectUserTypeComponent;

const SelectButtonContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 13px;
  margin-bottom: 24px;
`;

const SelectButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  margin: 15px 0;
  border-radius: 22px;

  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.bluePrimary : theme.colors.white};
  border-width: 3px;
  border-color: ${({ theme, isSelected }) =>
    isSelected ? 'transparent' : theme.colors.bluePrimary};
`;

const ButtonText = styled.Text<{ isSelected: boolean }>`
  font-weight: 600;
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  margin-top: 8px;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.bluePrimary};
`;
