import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import HomeButton from '../../components/common/HomeButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import MissionList from '../../components/point/MissionList';
import { ScrollView } from 'react-native';
import { getPointsBalance } from '../../api/mission-controller';
import { MISSIONS, MissionDetail } from '../../constants/missions';
import Gift from '../../assets/point/gift.svg';

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
              <Point accessibilityLabel={`${point}포인트`}>{point}P</Point>
            </PointWrapper>
            <ButtonContainer>
              <Button
                onPress={() => navigation.navigate('PointList' as never)}
                accessibilityLabel="내역 보기 버튼"
                accessibilityHint="포인트 적립 및 사용 내역 화면으로 이동합니다"
              >
                <ButtonText>내역보기</ButtonText>
              </Button>
              <Button
                onPress={() =>
                  navigation.navigate('UsePoint' as any, { point })
                }
                accessibilityLabel="사용하기 버튼"
                accessibilityHint={`현재 ${point}포인트를 사용할 수 있는 상품 목록으로 이동합니다`}
              >
                <ButtonText>사용하기</ButtonText>
              </Button>
            </ButtonContainer>
            <ButtonContainer>
              <GiftButton
                onPress={() => navigation.navigate('ReceivedGift' as never)}
                accessibilityLabel="선물함 버튼"
                accessibilityHint="선물함 화면으로 이동합니다"
              >
                <Gift />
                <ButtonText>선물함</ButtonText>
              </GiftButton>
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

const GiftButton = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  padding: 10px 0;
  background-color: ${({ theme }) => theme.colors.yellowPrimary};
  border-radius: 33px;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
