import React, { ReactNode } from 'react';
import styled from 'styled-components/native';

type BasicRuleProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
};

const BasicRule: React.FC<BasicRuleProps> = ({ title, description, icon }) => {
  return (
    <Container>
      <Title>{title}</Title>

      <IconWrapper>{icon}</IconWrapper>

      <Description>{description}</Description>
    </Container>
  );
};

export default BasicRule;

const Container = styled.View`
  width: 85%;
  flex: 1;
  padding: 20px 24px 0px 24px;
  align-items: center;
  align-self: center;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  font-weight: 700;
  color: #111111;
  text-align: center;
`;

const IconWrapper = styled.View`
  width: 100%;
  padding: 30px 0px;
  margin: 30px 0px;
  border-width: 1px;
  border-radius: 24px;
  border-style: dashed;
  border-color: #bedaff;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  line-height: 28px;
  color: #333333;
  text-align: center;
`;
