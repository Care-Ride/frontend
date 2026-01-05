import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Search from '../../assets/common/search.svg';
import BackButton from '../../components/common/BackButton';
import { postDriveStart } from '../../api/driving-controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postDriveDanger } from '../../api/driving-controller';

const ReadyDriving = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { lat, lon } = route.params || {};
  const [isNightDrive, setIsNightDrive] = useState(false);
  const [weather, setWeather] = useState('');

  const createDriveDanger = async () => {
    try {
      const response = await postDriveDanger(lat, lon);
      setIsNightDrive(response?.data.data.isNightDrive);
      setWeather(response?.data.data.weather);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartDriving = async () => {
    await createDriveDanger();
    navigation.navigate(
      'DrivingDanger' as never,
      { destination, lat, lon, isNightDrive, weather } as never,
    );
  };

  const selectedDestination = route.params?.destination ?? '';
  const [destination, setDestination] = useState(selectedDestination);
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('accessToken in AsyncStorage:', token);
    };

    checkToken();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <StartText>운전 시작하기</StartText>
        <DestinationContainer>
          <DestinationText>목적지</DestinationText>
          <DestinationInputWrapper>
            <DestinationText>{destination}</DestinationText>
          </DestinationInputWrapper>
        </DestinationContainer>
        <StartButton onPress={handleStartDriving} accessibilityRole="button">
          <ButtonText>운전 시작하기</ButtonText>
        </StartButton>
      </Container>
    </SafeAreaView>
  );
};
export default ReadyDriving;

const Container = styled.View`
  flex: 1;
  margin-top: 140px;
`;

const StartText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(32 * theme.fontScale)};
  align-self: center;
  font-weight: 600;
`;

const DestinationContainer = styled.View`
  display: flex;
  margin: 40px 20px;
`;

const DestinationText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 600;
`;

const DestinationInputWrapper = styled.View`
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

const StartButton = styled.TouchableOpacity`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.bluePrimary};
  width: 300px;
  height: 52px;
  border-radius: 33px;
  align-self: center;
`;
const ButtonText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  color: ${({ theme }) => theme.colors.white};
`;
