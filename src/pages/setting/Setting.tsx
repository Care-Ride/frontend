import React, { useState } from 'react';
import styled from 'styled-components/native';
import HomeButton from '../../components/common/HomeButton';
import Car from '../../assets/drivingRecord/car.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SelectList from '../../components/common/SelectList';
import { ActionModal } from '../../components/common/Modal';
import Logout from '../../assets/common/logout.svg';
import { useAuth } from '../../AuthContext';

const Setting = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation();
  const [logoutVisible, setLogoutVisible] = useState(false);

  const openLogoutModal = () => {
    setLogoutVisible(true);
  };

  const closeLogoutModal = () => {
    setLogoutVisible(false);
  };

  const handleLogoutConfirm = async () => {
    signOut();
    closeLogoutModal();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <HomeButton />

      <Container>
        <Title>설정</Title>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 70 }}
          showsVerticalScrollIndicator={false}
        >
          <SelectList
            title="알림 설정"
            icon={<Car />}
            options={[
              {
                label: '소리 크기 설정',
                onPress: () => navigation.navigate('SoundSetting' as never),
              },
              // {
              //   label: '진동 세기 설정',
              //   onPress: () => navigation.navigate('VibrationSetting' as never),
              // },
            ]}
          />

          <SelectList
            title="화면 설정"
            icon={<Car />}
            options={[
              {
                label: '글자 크기 설정',
                onPress: () => navigation.navigate('FontSetting' as never),
              },
            ]}
          />

          <SelectList
            title="블루투스 연결 설정"
            icon={<Car />}
            options={[
              {
                label: '블루투스 설정',
                onPress: () => navigation.navigate('ConnectBluetooth' as never),
              },
            ]}
          />

          <SelectList
            title="계정 관리"
            icon={<Car />}
            options={[
              {
                label: '운전자 연동 관리',
                onPress: () => {
                  navigation.navigate('LinkDriver' as never);
                },
              },
              {
                label: '로그아웃',
                onPress: openLogoutModal,
              },
              {
                label: '회원 탈퇴',
                onPress: () => {
                  navigation.navigate('Withdraw' as never);
                },
              },
            ]}
          />
        </ScrollView>
        <ActionModal
          visible={logoutVisible}
          title="로그아웃 할까요?"
          body="로그아웃 후에도 언제든지 다시 로그인할 수 있습니다. 로그아웃이 완료되면 자동으로 로그인 화면으로 넘어갑니다."
          badgeIcon={<Logout />}
          confirmText="로그아웃"
          cancelText="취소"
          onConfirm={handleLogoutConfirm}
          onCancel={closeLogoutModal}
          onRequestClose={closeLogoutModal}
        />
      </Container>
    </SafeAreaView>
  );
};

export default Setting;

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
