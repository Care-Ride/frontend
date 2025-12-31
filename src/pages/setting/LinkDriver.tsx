import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/common/BackButton';
import Car from '../../assets/drivingRecord/car.svg';
import SelectList from '../../components/common/SelectList';
import {
  getMember,
  getMemberLinkSenior,
  getMemberLinkGuardian,
  deleteMemberlink,
} from '../../api/member-controller';
import { ActionModal, SimpleInfoModal } from '../../components/common/Modal';

type Role = 'SENIOR' | 'GUARDIAN' | '';

const RELATION_LABEL_MAP: Record<string, string> = {
  PARENT: '부모',
  CHILD: '자녀',
  GRANDPARENT: '조부모',
  GRANDCHILD: '손자녀',
  CAREGIVER: '보호자/돌봄자',
  FRIEND: '친구',
  CUSTOM: '직접 입력',
};

const LinkDriver = () => {
  const navigation = useNavigation();
  const [myName, setMyName] = useState('');
  const [role, setRole] = useState<Role>('');

  const [linkedName, setLinkedName] = useState('');
  const [linkedRelation, setLinkedRelation] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDoneModal, setShowDoneModal] = useState(false);

  const roleName = useMemo(() => {
    return role === 'SENIOR' ? '보호자' : role === 'GUARDIAN' ? '운전자' : '';
  }, [role]);

  const readMember = async () => {
    try {
      const response = await getMember();
      setMyName(response?.data.data.nickname);
      setRole(response?.data.data.role);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    readMember();
  }, []);
  console.log(role, 'role');

  const delMemberLink = async () => {
    try {
      await deleteMemberlink();
      await readMemberAndLink();
      setShowConfirmModal(false);
      setShowDoneModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLinkPress = () => {
    if (role === 'SENIOR') {
      navigation.navigate('GetCode' as never);
    } else if (role === 'GUARDIAN') {
      navigation.navigate('EnterCode' as never);
    } else {
      console.log('role 정보가 없습니다.');
    }
  };

  const isLinked = useMemo(() => {
    return !!linkedName && linkedName !== '아직 연결 안됨';
  }, [linkedName]);

  const linkOptions = useMemo(() => {
    const opts = [
      {
        label: `${roleName} 연동하기`,
        onPress: handleLinkPress,
      },
    ];

    if (isLinked) {
      opts.push({
        label: `${roleName} 연동 해제하기`,
        onPress: () => setShowConfirmModal(true),
      });
    }

    return opts;
  }, [roleName, handleLinkPress, isLinked]);

  const readMemberAndLink = async () => {
    try {
      // 1) 내 정보
      const meRes = await getMember();
      const me = meRes?.data?.data;

      const myNickname = me?.nickname ?? '';
      const myRole = (me?.role ?? '') as Role;

      setMyName(myNickname);
      setRole(myRole);

      // 2) role에 따라 연결된 상대 조회
      if (myRole === 'SENIOR') {
        // SENIOR(운전자) => 보호자 정보 조회
        const linkRes = await getMemberLinkGuardian();
        const link = linkRes?.data?.data;

        if (!link) {
          setLinkedName('아직 연결 안됨');
          setLinkedRelation('');
        } else {
          const guardianNickname = link?.guardianName ?? '';
          const relationRaw = link?.relationType ?? '';
          setLinkedName(guardianNickname);
          setLinkedRelation(
            RELATION_LABEL_MAP[relationRaw] ?? relationRaw ?? '',
          );
        }
      }

      if (myRole === 'GUARDIAN') {
        const linkRes = await getMemberLinkSenior();
        const link = linkRes?.data?.data;

        if (!link) {
          setLinkedName('아직 연결 안됨');
          setLinkedRelation('');
        } else {
          const seniorNickname = link?.seniorName ?? '';
          const relationRaw = link?.relationType ?? '';
          setLinkedName(seniorNickname);
          setLinkedRelation(
            RELATION_LABEL_MAP[relationRaw] ?? relationRaw ?? '',
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      readMemberAndLink();
    }, [readMemberAndLink]),
  );

  const leftCard = useMemo(() => {
    if (role === 'SENIOR') {
      return {
        label: '운전자 성함',
        value: `${myName}`,
        showRelation: false,
      };
    }
    if (role === 'GUARDIAN') {
      return {
        label: '보호자 성함',
        value: `${myName}`,
        showRelation: false,
      };
    }
    return { label: '이름', value: myName, showRelation: false };
  }, [role, myName]);

  const rightCard = useMemo(() => {
    const relationSuffix = linkedRelation ? `(${linkedRelation})` : '';
    if (role === 'SENIOR') {
      return {
        label: '보호자 성함',
        value: linkedName ? `${linkedName}${relationSuffix}` : '-',
        showRelation: true,
      };
    }
    if (role === 'GUARDIAN') {
      return {
        label: '운전자 성함',
        value: linkedName ? `${linkedName}${relationSuffix}` : '-',
        showRelation: true,
      };
    }
    return { label: '상대', value: linkedName || '-', showRelation: false };
  }, [role, linkedName, linkedRelation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <SectionContainer>
          <InfoContainer>
            <InfoCard style={{ marginRight: 12 }}>
              <CardLabel>{leftCard.label}</CardLabel>
              <CardValue>{leftCard.value}</CardValue>
            </InfoCard>

            <InfoCard>
              <CardLabel>{rightCard.label}</CardLabel>
              <CardValue>{rightCard.value}</CardValue>
            </InfoCard>
          </InfoContainer>
        </SectionContainer>
        <SelectList
          title={`${roleName} 연동관리`}
          icon={<Car />}
          options={linkOptions}
        />
      </Container>
      <ActionModal
        visible={showConfirmModal}
        title="보호자 연동 해제하기"
        bodyLines={[`${rightCard.value}과의 연동을 해제할까요?`]}
        confirmText="해제하기"
        cancelText="취소"
        onConfirm={delMemberLink}
        onCancel={() => setShowConfirmModal(false)}
        onRequestClose={() => setShowConfirmModal(false)}
      />
      <SimpleInfoModal
        visible={showDoneModal}
        title="보호자 연동 해제 완료"
        bodyLines={[`${rightCard.value}님과의 연동이 해제되었습니다.`]}
        onConfirm={() => setShowDoneModal(false)}
        onRequestClose={() => setShowDoneModal(false)}
      />
    </SafeAreaView>
  );
};
export default LinkDriver;

const SectionContainer = styled.View`
  display: flex;
  flex-direction: column;
  margin: 25px 0px 30px 0px;
`;

const Container = styled.View`
  margin: 0 20px;
`;

const InfoContainer = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 15px;
`;
const InfoCard = styled.View`
  flex: 1;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.yellowPrimary};
  background-color: ${({ theme }) => theme.colors.yellowSecondary};
`;

const CardLabel = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  font-weight: 600;
  color: #666666;
  margin-bottom: 6px;
`;

const CardValue = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(18 * theme.fontScale)};
  font-weight: 700;
  color: #000000;
`;
