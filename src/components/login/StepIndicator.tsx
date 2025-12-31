import React from 'react';
import styled from 'styled-components/native';

type Props = {
  currentStep: number;
  totalSteps?: number;
};

const StepIndicator: React.FC<Props> = ({ currentStep, totalSteps = 2 }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <Container>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <Circle active={step === currentStep}>
            <CircleText active={step === currentStep}>{step}</CircleText>
          </Circle>

          {index !== steps.length - 1 && <DashLine />}
        </React.Fragment>
      ))}
    </Container>
  );
};

export default StepIndicator;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
`;

const Circle = styled.View<{ active: boolean }>`
  border-radius: 50px;
  align-items: center;
  justify-content: center;

  background-color: ${({ active }) => (active ? '#FFC94A' : '#001833')};
  width: ${({ active }) => (active ? '43px' : '30px')};
  height: ${({ active }) => (active ? '43px' : '30px')};
  border-width: ${({ active }) => (active ? 0 : 2)}px;
  border-color: #001833;
`;

const CircleText = styled.Text<{ active: boolean }>`
  font-size: ${({ active }) => (active ? '24px' : '17px')};
  font-weight: 700;
  color: ${({ active }) => (active ? '#000000' : '#ffffff')};
`;

const DashLine = styled.View`
  width: 24px;
  height: 1px;
  border-width: 1px;
  border-style: dashed;
  border-color: #9ea4b1;
  margin: 0 4px;
`;
