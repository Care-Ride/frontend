import styled from 'styled-components/native';
import MirrorIcon from '../../assets/drivingAction/mirror.svg';
import BasicRule from '../../components/drivingAction/BasicRule';
import BottomStepButtons from '../../components/common/BottomStepButton';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

const BasicRuleMirror = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { curLat, curLon } = route.params || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <Title>운전 점검</Title>
        <BasicRule
          title="사이드미러와 백미러가 잘 펴져있나요?"
          description="사이드미러와 백미러로 시야를 확보하고 운전해주세요."
          icon={<MirrorIcon />}
        />
        <BottomStepButtons
          onPressPrev={() => navigation.goBack()}
          onPressNext={() =>
            navigation.navigate('ReactivityTest', {
              curLat,
              curLon,
            } as never)
          }
          prevText="뒤로가기"
          nextText="다음"
        />
      </Container>
    </SafeAreaView>
  );
};

export default BasicRuleMirror;

const Container = styled.View`
  flex: 1;
`;
const Title = styled.Text`
  font-size: 24px;
  align-self: center;
  margin: 20px 0 90px 0;
`;
