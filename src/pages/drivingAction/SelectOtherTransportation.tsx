import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import HomeButton from '../../components/common/HomeButton';
import SelectTransportationComponent from '../../components/common/SelectTransportationComponent';
import BackButton from '../../components/common/BackButton';

const SelectOtherTransportation = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <Title>다른 이동수단 부르기</Title>
        <SubTitle>어떤 이동수단을 부를까요?</SubTitle>

        <SelectTransportationComponent />

        <Description>
          운전노하우는 결제서비스를 제공하지 않습니다. 기사님에게 직접 비용을
          지불해주세요.
        </Description>
      </Container>
    </SafeAreaView>
  );
};

export default SelectOtherTransportation;

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(32 * theme.fontScale)};
  font-weight: 600;
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 500;
  margin-bottom: 24px;
`;

const Description = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  text-align: center;
  padding: 0 24px;
`;
