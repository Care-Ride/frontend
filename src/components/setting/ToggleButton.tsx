import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/native';

type ToggleButtonProps = {
  value: boolean;
  onChange: (next: boolean) => void;
  onLabel?: string;
  offLabel?: string;
  width?: number;
  height?: number;
};

const ToggleButton = ({
  value,
  onChange,
  onLabel = '켜짐',
  offLabel = '꺼짐',
  width = 100,
  height = 40,
}: ToggleButtonProps) => {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  const padding = 4;
  const thumbH = height - padding * 2;
  const thumbW = Math.round(width * 0.52);
  const travel = width - padding * 2 - thumbW;

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travel],
  });

  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#6D767F', '#f4b400'],
  });

  const label = value ? onLabel : offLabel;

  return (
    <TogglePress
      activeOpacity={0.9}
      onPress={() => onChange(!value)}
      style={{ width, height }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <AnimatedWrap
        style={{ backgroundColor: bgColor, borderRadius: height / 2, padding }}
      >
        <Thumb
          style={{
            width: thumbW,
            height: thumbH,
            borderRadius: thumbH / 2,
            transform: [{ translateX }],
          }}
        >
          <ThumbInner value={value}>
            <ThumbText value={value}>{label}</ThumbText>
          </ThumbInner>
        </Thumb>
      </AnimatedWrap>
    </TogglePress>
  );
};

export default ToggleButton;

const TogglePress = styled.TouchableOpacity``;

const AnimatedWrap = styled(Animated.View)`
  flex: 1;
  justify-content: center;
`;

const Thumb = styled(Animated.View)`
  position: absolute;
  left: 4px;
  top: 4px;
`;

const ThumbInner = styled.View<{ value: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;

  background-color: ${({ value }) => (value ? '#ffffff' : '#d9dde1')};

  border-width: 1px;
  border-color: ${({ value }) => (value ? '#b58a1a' : '#797979ff')};

  border-radius: 999px;
`;

const ThumbText = styled.Text<{ value: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ value }) => (value ? '#111111' : '#2f363c')};
`;
