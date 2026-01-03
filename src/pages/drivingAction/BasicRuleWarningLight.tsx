import styled from 'styled-components/native';
import WarningLightIcon from '../../assets/drivingAction/warninglight.svg';
import BasicRule from '../../components/drivingAction/BasicRule';
import BottomStepButtons from '../../components/common/BottomStepButton';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

const BasicRuleWarningLight = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { destination, lat, lon } = route.params || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <Title>운전 점검</Title>
        <BasicRule
          title="계기판에 경고등이 켜져있지는 않나요?"
          description="계기판에 경고등이 켜졌다면 가까운 자동차 수리점을 방문하세요."
          icon={<WarningLightIcon />}
        />
        <BottomStepButtons
          onPressPrev={() => navigation.goBack()}
          onPressNext={() =>
            navigation.navigate('ReactivityTest', {
              destination,
              lat,
              lon,
            } as never)
          }
          prevText="뒤로가기"
          nextText="다음"
        />
      </Container>
    </SafeAreaView>
  );
};

export default BasicRuleWarningLight;

const Container = styled.View`
  flex: 1;
`;
const Title = styled.Text`
  font-size: 24px;
  align-self: center;
  margin: 20px 0 90px 0;
`;
