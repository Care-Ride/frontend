import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackButton from '../../components/common/BackButton';
import UnbalanceButton from '../../components/common/UnbalanceButton';

const DrivingDanger = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { destination, lat, lon, isNightDrive, weather } = route.params || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <StartText>운전 전 위험</StartText>
        {!weather && !isNightDrive && (
          <NoDangerText>
            감지된 위험이 없습니다.{'\n'} 안전운전 하세요.
          </NoDangerText>
        )}
        <DestinationContainer>
          {weather && (
            <DangerTextContainer>
              <DestinationText>{weather}</DestinationText>
            </DangerTextContainer>
          )}
          {isNightDrive && (
            <DangerTextContainer>
              <DestinationText>{isNightDrive}</DestinationText>
            </DangerTextContainer>
          )}
        </DestinationContainer>
        <ButtonContainer>
          {(weather || isNightDrive) && (
            <DescriptionText>
              전부 확인하기 전에는 운전하기 버튼이 활성화되지 않습니다
            </DescriptionText>
          )}
          <UnbalanceButton
            onPressPrev={() =>
              navigation.navigate('BasicRuleBelt', {
                destination,
                lat,
                lon,
              } as never)
            }
            prevText="운전하기"
            onPressNext={() =>
              navigation.navigate('AlternativeTransportation', {
                screen: 'SelectTransportation',
              })
            }
            nextText="다른 이동수단 이용하기"
          />
        </ButtonContainer>
      </Container>
    </SafeAreaView>
  );
};
export default DrivingDanger;

const Container = styled.View`
  flex: 1;
  margin-top: 130px;
`;
const StartText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(32 * theme.fontScale)};
  align-self: center;
  font-weight: 600;
`;

const NoDangerText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(23 * theme.fontScale)};
  margin-top: 50px;
  text-align: center;
  line-height: 40px;
`;
const DestinationContainer = styled.View`
  display: flex;
  margin: 40px 20px;
  gap: 10px;
`;

const ButtonContainer = styled.View`
  margin-top: 30px;
`;

const DescriptionText = styled.Text`
  align-self: center;
  text-align: center;
  width: 70%;
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  margin-bottom: 10px;
`;

const DangerTextContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 16px;
  height: 55px;
  border-radius: 22px;
  background-color: #feefd2;
  border: 1px solid ${({ theme }) => theme.colors.yellowPrimary};
`;

const DestinationText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  color: #a0a0a0;
`;
