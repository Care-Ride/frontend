import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import HomeButton from '../../components/common/HomeButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectList from '../../components/common/SelectList';
import { useNavigation } from '@react-navigation/native';
import MissionList from '../../components/point/MissionList';
import { ScrollView } from 'react-native';
import { getMissions } from '../../api/mission-controller';
import { getPointsBalance } from '../../api/mission-controller';
import { MISSIONS, MissionDetail } from '../../constants/missions';

const MyPoint = () => {
  const navigation = useNavigation();
  const [point, setPoint] = useState(0);
  const [missions, setMissions] = useState<MissionDetail[]>([]);

  useEffect(() => {
    const missionList: MissionDetail[] = MISSIONS;
    const mapped = missionList.map(m => ({
      id: m.id,
      title: m.title,
      detail: m.detail,
      rewardPoint: m.rewardPoint,
    }));
    setMissions(mapped);
  }, []);

  //누적 포인트 API 연결
  useEffect(() => {
    const readPointsBalance = async () => {
      try {
        const response = await getPointsBalance();
        setPoint(response.data.data.balance);
      } catch (err) {
        console.error(err);
      }
    };

    readPointsBalance();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HomeButton />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
      >
        <Container>
          <Title>포인트 얻기</Title>
          <PointContainer>
            <PointWrapper>
              <Label>나의 포인트</Label>
              <Point>{point}P</Point>
            </PointWrapper>
            <ButtonContainer>
              <Button onPress={() => navigation.navigate('PointList' as any)}>
                <ButtonText>내역보기</ButtonText>
              </Button>
              <Button>
                <ButtonText>사용하기</ButtonText>
              </Button>
            </ButtonContainer>
          </PointContainer>

          <MissionList missions={missions} />
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyPoint;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
  align-items: center;
  margin: 0 20px 20px 20px;
`;
const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(24 * theme.fontScale)};
  font-weight: 600;
`;
const PointContainer = styled.View`
  width: 100%;
  margin: 30px 20px 0px 20px;
  border: 2px solid ${({ theme }) => theme.colors.yellowPrimary};
  border-radius: 22px;
`;
const PointWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 23px 20px;
  margin: 15px;
  background-color: ${({ theme }) => theme.colors.bluePrimary};
  border-radius: 16px;
`;
const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 0 15px 15px 15px;
`;
const Button = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: 10px 0px;
  width: 48%;
  border: 2px solid ${({ theme }) => theme.colors.yellowPrimary};
  border-radius: 33px;
`;

const ButtonText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 500;
`;

const Label = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  color: ${({ theme }) => theme.colors.yellowPrimary};
  font-weight: 600;
`;

const Point = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(32 * theme.fontScale)};
  color: white;
  font-weight: 600;
`;
