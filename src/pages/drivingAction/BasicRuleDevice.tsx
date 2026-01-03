import styled from 'styled-components/native';
import GlassesIcon from '../../assets/drivingAction/glasses.svg';
import BasicRule from '../../components/drivingAction/BasicRule';
import BottomStepButtons from '../../components/common/BottomStepButton';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

const BasicRuleDevice = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { destination, lat, lon } = route.params || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <Title>운전 점검</Title>
        <BasicRule
          title="안경, 보청기 등 보조기구를 잘 착용하였나요?"
          description="사용하는 보조기구가 있으면 꼭 착용 후 운전해주세요."
          icon={<GlassesIcon />}
        />
        <BottomStepButtons
          onPressPrev={() => {
            navigation.goBack();
          }}
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

export default BasicRuleDevice;

const Container = styled.View`
  flex: 1;
`;
const Title = styled.Text`
  font-size: 24px;
  align-self: center;
  margin: 20px 0 90px 0;
`;
