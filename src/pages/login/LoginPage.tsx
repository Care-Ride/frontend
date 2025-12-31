import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, Alert } from 'react-native';
// import { useAuth } from '../../AuthContext';
import Logo from '../../assets/common/logo_yellow.svg';
import Kakao from '../../assets/login/kakao.svg';
import Naver from '../../assets/login/naver.svg';
import Google from '../../assets/login/google.svg';

import { useNavigation } from '@react-navigation/native';

import { api } from '../../api/api';
import { useAuth } from '../../AuthContext';

const LoginPage = () => {
  const { signInWithOAuth } = useAuth();
  const navigation = useNavigation<any>();
  const handleGoogleLogin = async () => {
    try {
      const signInObj = await signInWithOAuth('google');
      console.log('Google Login', signInObj);
      // // 로그인 성공 → 홈 화면으로 이동
      // navigation.navigate('LoginConsent', { obj: signInObj });
    } catch (err: any) {
      console.error('Google login failed', err);
      Alert.alert('로그인 실패', 'Google 로그인에 실패했습니다.');
    }
  };
  const handleKakaoLogin = async () => {
    try {
      const signInObj = await signInWithOAuth('kakao');
      console.log('ddd', signInObj);
    } catch (err: any) {
      console.error('Kakao login failed', err);
      Alert.alert('로그인 실패', 'Kakao 로그인에 실패했습니다.');
    }
  };

  return (
    <Container>
      <Center>
        <Logo />
        <DescriptionText>내 손안의 안전 운전 도우미</DescriptionText>
        <LogoText>운전 노하우</LogoText>
        <LoginContainer>
          <ButtonContainer onPress={handleKakaoLogin}>
            <Kakao />
            <LoginText>카카오톡으로 시작하기</LoginText>
          </ButtonContainer>
          <ButtonContainer onPress={handleGoogleLogin}>
            <Google />
            <LoginText>구글로 시작하기</LoginText>
          </ButtonContainer>
        </LoginContainer>
      </Center>
    </Container>
  );
};

export default LoginPage;

const Container = styled.View`
  flex: 1;
  background-color: white;
`;
const Center = styled.View`
  flex: 1;
  margin-top: 60px;
  justify-content: center;
  align-items: center;
`;

const DescriptionText = styled.Text`
  margin-top: 25px;
  font-size: 24px;
  font-weight: 700;
`;

const LogoText = styled.Text`
  margin-top: 15px;
  font-size: 32px;
  font-weight: 800;
`;
const LoginContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
  gap: 12px;
`;
const ButtonContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.bluePrimary};
  width: 345px;
  height: 65px;
  border-radius: 22px;
  gap: 15px;
`;

const LoginText = styled.Text`
  font-size: 22px;
  color: ${({ theme }) => theme.colors.white};
`;
