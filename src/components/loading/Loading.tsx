// components/common/GlobalLoading.tsx
import React from 'react';
import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';
import { useAtomValue } from 'jotai';
import { isLoadingAtom } from '../../atoms/loadingAtom';

export const GlobalLoading: React.FC = () => {
  const isLoading = useAtomValue(isLoadingAtom);

  if (!isLoading) return null;

  return (
    <Overlay pointerEvents="auto">
      <Box>
        <ActivityIndicator size="large" />
        <LoadingText>로딩 중입니다...</LoadingText>
      </Box>
    </Overlay>
  );
};

export const DriveLoading: React.FC = () => {
  const isLoading = useAtomValue(isLoadingAtom);

  if (!isLoading) return null;

  return (
    <Overlay pointerEvents="auto">
      <Box>
        <ActivityIndicator size="large" />
        <LoadingText>
          운전 노하우가 목적지까지의 실시간 위험을 탐색하고 있습니다.
        </LoadingText>
      </Box>
    </Overlay>
  );
};

const Overlay = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 9999;
`;

const Box = styled.View`
  padding: 16px 20px;
  border-radius: 12px;
  background-color: white;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.Text`
  margin-top: 8px;
  font-size: ${({ theme }) => theme.scaleFont(14 * theme.fontScale)};
  color: #333333;
`;
