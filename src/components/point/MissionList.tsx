import React, { useState } from 'react';
import styled from 'styled-components/native';
import Point from '../../assets/point/point.svg';
import Car from '../../assets/point/car.svg';
import Person from '../../assets/point/person.svg';
import { SimpleInfoModal } from '../common/Modal';
import { MissionDetail } from '../../constants/missions';

// type MissionDetailProps = {
//   id: string;
//   title: string;
//   detail: string;
//   rewardPoint: number;
//   status: string;
// };

type MissionProps = {
  missions: MissionDetail[];
};

const MissionList: React.FC<MissionProps> = ({ missions }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState<MissionDetail | null>(
    null,
  );

  const openDetailModal = (mission: MissionDetail) => {
    console.log('clicked mission:', mission);
    setSelectedMission(mission);
    setShowModal(true);
  };

  const closeDetailModal = () => {
    setShowModal(false);
    setSelectedMission(null);
  };

  return (
    <Container>
      <Header>미션 참여하기</Header>
      {missions.map(mission => (
        <MissionContainer key={mission.id}>
          <TitleWrapper>
            <Icon>{mission.id === 'LINK_GUARDIAN' ? <Person /> : <Car />}</Icon>
            <Title>{mission.title}</Title>
          </TitleWrapper>
          <PointContainer>
            <PointWrapper>
              <Point />
              <PointText>{mission.rewardPoint}P</PointText>
            </PointWrapper>
            <Button onPress={() => openDetailModal(mission)}>
              <ButtonText>설명 보기</ButtonText>
            </Button>
          </PointContainer>
        </MissionContainer>
      ))}
      <SimpleInfoModal
        visible={showModal}
        title={'미션 상세'}
        bodyLines={(selectedMission?.detail ?? '').split('\n')}
        confirmText="닫기"
        onConfirm={closeDetailModal}
        onRequestClose={closeDetailModal}
      />
    </Container>
  );
};

export default MissionList;

const Container = styled.View`
  width: 100%;
`;
const Header = styled.Text`
  font-size: 18px;
  font-weight: 500;
  margin: 30px 20px 5px 0px;
`;
const MissionContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 20px 20px;
  margin: 10px 0px;
  border-radius: 22px;
  background-color: ${({ theme }) => theme.colors.yellowSecondary};
  border: 2px solid ${({ theme }) => theme.colors.yellowPrimary};
`;
const TitleWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;
const Icon = styled.View``;
const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(20 * theme.fontScale)};
  font-weight: 600;
`;
const PointContainer = styled.View`
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;
const PointWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;
const PointText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(16 * theme.fontScale)};
  font-weight: 600;
`;
const Button = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.yellowPrimary};
  border-radius: 33px;
  padding: 4px 8px;
`;
const ButtonText = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(12 * theme.fontScale)};
  color: white;
`;
