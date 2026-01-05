import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components/native';
import BackButton from '../../components/common/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReceivedGift = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <BackButton />
      <Container>
        <Title>선물함</Title>
      </Container>
    </SafeAreaView>
  );
};

export default ReceivedGift;

const Container = styled.View`
  flex: 1;
  padding: 0 20px 20px 20px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.scaleFont(24 * theme.fontScale)};
  font-weight: 600;
  text-align: center;
  margin-top: 8px;
`;
