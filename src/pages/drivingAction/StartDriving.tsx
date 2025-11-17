import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

const StartDriving = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>StartDriving Screen</Text>
    </View>
  );
};
export default StartDriving;

const Layout = styled.View`
  display: flex;
`;
