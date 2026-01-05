import React from 'react';
import styled from 'styled-components/native';

type Option = {
  label: string;
  onPress?: () => void;
};

type SettingSectionProps = {
  title: string;
  icon?: React.ReactNode;
  options: Option[];
};

const SelectList: React.FC<SettingSectionProps> = ({
  title,
  icon,
  options,
}) => {
  return (
    <SectionContainer>
      <SectionHeaderContainer>
        <SectionTitle>{title}</SectionTitle>
        <RightIconWrapper>{icon}</RightIconWrapper>
      </SectionHeaderContainer>

      <DashedDivider />

      {options.map(option => (
        <OptionContainer key={option.label}>
          <OptionText>{option.label}</OptionText>
          <SelectButton
            onPress={option.onPress}
            activeOpacity={0.8}
            disabled={!option.onPress}
            accessibilityLabel={`${option.label} 선택 버튼`}
          >
            <SelectText>선택</SelectText>
          </SelectButton>
        </OptionContainer>
      ))}
    </SectionContainer>
  );
};

export default SelectList;

const SectionContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 30px;
`;

const SectionHeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
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
  margin-top: 8px;
  margin-bottom: 18px;
  border-bottom-width: 1px;
  border-bottom-color: #d0d0d0;
  border-style: dashed;
`;

const OptionContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0px 5px 15px 5px;
`;

const OptionText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  color: ${({ theme }) => theme.colors.black};
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
