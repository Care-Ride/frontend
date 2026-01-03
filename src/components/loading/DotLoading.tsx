// components/common/DotLoading.tsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';

const DotLoading = () => {
  const animations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const createSequence = () => {
      return Animated.sequence([
        Animated.timing(animations[0], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animations[1], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animations[2], {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.delay(100),
      ]);
    };

    const reset = () => {
      animations.forEach(a => a.setValue(0));
    };

    const loop = () => {
      reset();
      Animated.loop(createSequence()).start();
    };

    loop();
  }, []);

  const activeColor = '#0B1F3A';
  const inactiveColor = '#C7C7C7';

  return (
    <Container>
      {animations.map((anim, idx) => {
        const bgColor = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [inactiveColor, activeColor],
        });

        return <Dot key={idx} style={{ backgroundColor: bgColor }} />;
      })}
    </Container>
  );
};

export default DotLoading;

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

const Dot = styled(Animated.View)`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin: 0 8px;
`;
