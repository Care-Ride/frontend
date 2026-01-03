import React from 'react';
import styled from 'styled-components/native';
import HomeButton from '../../components/common/HomeButton';
import Car from '../../assets/drivingRecord/car.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectList from '../../components/common/SelectList';
import { useNavigation } from '@react-navigation/native';

const MyRecord = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HomeButton />
      <Container>
        <Title>나의 운전 기록</Title>
        <SelectList
          title="운전 기록 보기"
          icon={<Car />}
          options={[
            {
              label: '일별 운전 기록',
              onPress: () => {
                navigation.navigate('DailyRecord' as never);
              },
            },
            {
              label: '월별 운전 기록',
              onPress: () => {
                navigation.navigate('MonthlyRecord' as never);
              },
            },
          ]}
        />
      </Container>
    </SafeAreaView>
  );
};

export default MyRecord;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
  align-items: center;
  margin: 0 20px;
`;
const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(24 * theme.fontScale)};
  font-weight: 600;
`;
