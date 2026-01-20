import React, { useState, useMemo } from 'react';
import styled from 'styled-components/native';
import HomeButton from '../../components/common/HomeButton';
import Car from '../../assets/drivingRecord/car.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SelectList from '../../components/common/SelectList';
import { useAtomValue } from 'jotai';
import { memberAtom } from '../../atoms/memberAtom';

type Role = 'SENIOR' | 'GUARDIAN';

type ManualOption = {
  label: string;
  manualId: string;
};

const ROLE_MANUALS: Record<Role, ManualOption[]> = {
  SENIOR: [
    { label: '운전하기 안내', manualId: 'driving' },
    { label: '보호자 연동하기 안내', manualId: 'guardianLink' },
    { label: '포인트 얻기 안내', manualId: 'pointsEarn' },
    { label: '포인트 사용하기 안내', manualId: 'pointsUse' },
  ],
  GUARDIAN: [
    { label: '운전자 연동하기 안내', manualId: 'driverLink' },
    { label: '운전자 운전내역 확인 안내', manualId: 'driverRecordCheck' },
  ],
};

const ManualHome = () => {
  const navigation = useNavigation();
  const member = useAtomValue(memberAtom);

  const options = useMemo(() => {
    const role = member.role as Role | undefined;
    const list = role ? ROLE_MANUALS[role] ?? [] : [];

    return list.map(item => ({
      label: item.label,
      onPress: () =>
        navigation.navigate(
          'ManualDetail' as never,
          { manualId: item.manualId } as never,
        ),
    }));
  }, [member.role, navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HomeButton />
      <Container>
        <Title>사용법 안내</Title>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
        >
          <SelectList icon={<Car />} options={options} />
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};

export default ManualHome;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
  margin: 0 20px 15px 20px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(24 * theme.fontScale)};
  font-weight: 600;
  align-self: center;
`;
