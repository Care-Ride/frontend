import React, { useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import BrakeQuestion from '../../components/drivingAction/BrakeQuestion';
import Brake from '../../assets/drivingAction/brake.svg';
import BrakeAnswer from '../../assets/drivingAction/brake_answer.svg';
import BottomStepButtons from '../../components/common/BottomStepButton';

const BasicRuleBrake = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { destination, lat, lon } = route.params || {};

  const [selected, setSelected] = useState<'left' | 'right' | null>(null);

  // 브레이크가 왼쪽이라고 가정 (오른쪽이면 'right'로 바꾸기)
  const isCorrect = selected === 'left';

  const handleSelect = (choice: 'left' | 'right') => {
    setSelected(choice);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Container>
        <Title>운전 점검</Title>

        {selected === null && (
          <BrakeQuestion
            question="엑셀과 브레이크를 확인했나요?"
            guideText="다음 중 브레이크인 것을 눌러주세요."
            image={<Brake />}
            onSelect={handleSelect}
          />
        )}

        {selected !== null && (
          <>
            <ResultTitle>{isCorrect ? '정답입니다' : '오답입니다'}</ResultTitle>

            <ResultImageWrapper>
              <BrakeAnswer />
            </ResultImageWrapper>

            <ResultDescription>
              {isCorrect
                ? '브레이크 위치를 잘 알고 있네요!'
                : '브레이크는 왼쪽에 있어요.'}
            </ResultDescription>
          </>
        )}

        {selected !== null ? (
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
        ) : (
          <BottomStepButtons
            onPressPrev={() => {
              navigation.goBack();
            }}
            disabledNext={true}
            prevText="뒤로가기"
          />
        )}
      </Container>
    </SafeAreaView>
  );
};

export default BasicRuleBrake;

const Container = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 24px;
  align-self: center;
  margin: 20px 0 90px 0;
  font-weight: 600;
`;

const ResultTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
`;

const ResultImageWrapper = styled.View`
  align-self: center;
  width: 260px;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const ResultDescription = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(17 * theme.fontScale)};
  color: #555555;
  text-align: center;
  margin-top: 16px;
`;
