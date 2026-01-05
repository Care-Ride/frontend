import React from 'react';
import styled from 'styled-components/native';

type SettingTextProps = {
  title: string;
  description: string;
  showRange?: boolean;
};

const SettingText: React.FC<SettingTextProps> = ({
  title,
  description,
  showRange = true,
}) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>

      {showRange && <Description>1~6단계까지 설정이 가능합니다.</Description>}
    </Container>
  );
};

export default SettingText;

const Container = styled.View``;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  font-weight: 600;
  padding: 30px 0;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  padding: 0 0 30px 0;
`;
