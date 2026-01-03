import React from 'react';
import styled from 'styled-components/native';
import HomeButton from '../../components/common/HomeButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, CommonActions } from '@react-navigation/native';
import Search from '../../assets/common/search.svg';
import { BottomButton } from '../../components/common/BottomButton';
import Congrats from '../../assets/drivingAction/congrats.svg';

const DrivingDone = () => {
  const navigation = useNavigation();

  const goHomeAndResetDriving = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'StartDriving' as never }],
      }),
    );

    navigation.navigate('Home' as never);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <CongratsWrapper>
          <Congrats />
        </CongratsWrapper>
        <Text>운전이 종료되었어요 수고하셨어요!</Text>

        <BottomButton text="홈으로" onPress={goHomeAndResetDriving} />
      </Container>
    </SafeAreaView>
  );
};
export default DrivingDone;

const Container = styled.View`
  flex: 1;
  margin: 100px 20px 0px 20px;
`;

const CongratsWrapper = styled.View`
  position: relative;
  align-items: center;
  top: 0;
`;

const Text = styled.Text`
  position: absolute;
  top: 180;
  font-size: 32px;
  font-weight: 700;
  margin-top: 50px;
  text-align: center;
`;

const Description = styled.Text`
  position: absolute;
  top: 340;
  font-size: 18px;
  text-align: center;
`;
