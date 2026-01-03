import React from 'react';
import styled from 'styled-components/native';
import HomeButton from '../../components/common/HomeButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Search from '../../assets/common/search.svg';

const StartDriving = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HomeButton />
      <Container>
        <StartText>운전 시작하기</StartText>
        <DestinationContainer>
          <DestinationText>목적지를 입력하세요</DestinationText>
          <DestinationInputButton
            onPress={() => {
              navigation.navigate('SearchDestination' as never);
            }}
            activeOpacity={0.8}
          >
            <PlaceholderText>목적지를 입력해주세요</PlaceholderText>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
          </DestinationInputButton>
        </DestinationContainer>
        <StartButton
          onPress={() => navigation.navigate('BasicRuleBelt' as never)}
        >
          <ButtonText>목적지 없이 운전하기</ButtonText>
        </StartButton>
      </Container>
    </SafeAreaView>
  );
};
export default StartDriving;

const Container = styled.View`
  flex: 1;
  margin-top: 130px;
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
const DestinationInputButton = styled.TouchableOpacity`
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

const PlaceholderText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  color: #a0a0a0;
`;

const SearchIconWrapper = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
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
