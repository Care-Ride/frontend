import React from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../../assets/common/logo_white.svg';
import { useNavigation } from '@react-navigation/native';

const OnBoardingPage = () => {
  const navigation = useNavigation<any>();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LoginPage');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <Container>
      <Logo />
    </Container>
  );
};

export default OnBoardingPage;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.yellowPrimary};
`;
