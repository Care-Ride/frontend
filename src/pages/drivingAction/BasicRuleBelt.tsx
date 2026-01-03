import styled from 'styled-components/native';
import SeatBeltIcon from '../../assets/drivingAction/seatbelt.svg';
import BasicRule from '../../components/drivingAction/BasicRule';
import BottomStepButtons from '../../components/common/BottomStepButton';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

const BasicRuleBelt = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { destination, lat, lon } = route.params || {};
  console.log(destination, lat, lon);

  const RANDOM_SCREENS = [
    'BasicRuleMirror',
    'BasicRuleWarningLight',
    'BasicRuleBrake',
    'BasicRuleDevice',
  ] as const;

  const handleNext = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_SCREENS.length);
    const nextRoute = RANDOM_SCREENS[randomIndex];

    navigation.navigate(
      nextRoute as never,
      {
        destination,
        lat,
        lon,
      } as never,
    );
  };

  const handlePrev = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <Title>운전 점검</Title>
        <BasicRule
          title="안전벨트를 잘 착용하셨나요?"
          description="안전벨트는 안전운전의 첫 걸음이에요. 반드시 착용하고 운전해주세요."
          icon={<SeatBeltIcon />}
        />
        <BottomStepButtons
          onPressPrev={handlePrev}
          onPressNext={handleNext}
          prevText="뒤로가기"
          nextText="다음"
        />
      </Container>
    </SafeAreaView>
  );
};

export default BasicRuleBelt;

const Container = styled.View`
  flex: 1;
`;
const Title = styled.Text`
  font-size: 24px;
  align-self: center;
  margin: 20px 0 90px 0;
`;
