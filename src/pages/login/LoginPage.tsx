import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Alert } from 'react-native';
// import { useAuth } from '../../AuthContext';
import Logo from '../../assets/common/logo_yellow.svg';
import Kakao from '../../assets/login/kakao.svg';
import Naver from '../../assets/login/naver.svg';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  //   const { signInWithOAuth } = useAuth();
  const navigation = useNavigation<any>();
  const handleGoogleLogin = async () => {
    // try {
    //   const signInObj = await signInWithOAuth('google');
    //   // 로그인 성공 → 홈 화면으로 이동
    //   navigation.navigate('LoginConsent', { obj: signInObj });
    // } catch (err: any) {
    //   console.error('Google login failed', err);
    //   Alert.alert('로그인 실패', 'Google 로그인에 실패했습니다.');
    // }
  };
  const handleKakaoLogin = async () => {
    //카카오 로그인 코드 채워넣기
  };
  const handleAppleLogin = async () => {
    //애플 로그인 코드 채워넣기
  };

  // const handleEmailLogin = async () => {
  //   try {
  //     await signInWithPassword('test@example.com', 'password123');
  //     navigation.replace('Home');
  //   } catch (err: any) {
  //     Alert.alert('로그인 실패', '이메일/비밀번호를 확인하세요.');
  //   }
  // };

  return (
    <Layout>
      <Center>
        <Logo />
        <LogoText>내 손 안의 운전 도우미</LogoText>
        <LoginText>지금 로그인하세요</LoginText>
        <LoginContainer>
          <ButtonContainer>
            <TouchableOpacity onPress={handleGoogleLogin}>
              <Kakao />
            </TouchableOpacity>
          </ButtonContainer>
          <ButtonContainer>
            <TouchableOpacity onPress={handleAppleLogin}>
              <Naver />
            </TouchableOpacity>
          </ButtonContainer>
        </LoginContainer>
      </Center>
    </Layout>
  );
}

const Layout = styled.View`
  flex: 1;
  background-color: white;
`;
const Center = styled.View`
  flex: 1;
  margin-top: 60px;
  justify-content: center;
  align-items: center;
`;

const LogoText = styled.Text`
  font-size: 16px;
  margin-top: 18px;
`;

const LoginContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
`;
const LoginText = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.bluePrimary};
  font-weight: 700;
`;
const ButtonContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 25px;
  margin: 20px;
  background-color: ${({ theme }) => theme.colors.bluePrimary};
`;
